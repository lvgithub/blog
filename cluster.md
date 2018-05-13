
## 从Node.Js源码一步步分析，cluster 多次fork一份代码时，如何实现端口重用

起源，从官方实例中看多进程共用端口
```
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```
执行结果：
 ```
$ node server.js
Master 3596 is running
Worker 4324 started
Worker 4520 started
Worker 6056 started
Worker 5644 started
```
了解http.js模块：
  * 我们都只有要创建一个http服务，必须引用http模块,http模块最终会调用net.js实现网络服务
 ```
// lib/net.js
'use strict';

  ...
Server.prototype.listen = function(...args) {
    ...
   if (options instanceof TCP) {
      this._handle = options;
      this[async_id_symbol] = this._handle.getAsyncId();
      listenInCluster(this, null, -1, -1, backlogFromArgs); // 注意这个方法调用了cluster模式下的处理办法
      return this;
    }
    ...
};

function listenInCluster(server, address, port, addressType,backlog, fd, exclusive) {
// 如果是master 进程或者没有开启cluster模式直接启动listen
if (cluster.isMaster || exclusive) {
    //_listen2,细心的人一定会发现为什么是listen2而不直接使用listen
   // _listen2 包裹了listen方法，如果是Worker进程，会调用被hack后的listen方法，从而避免出错端口被占用的错误
    server._listen2(address, port, addressType, backlog, fd);
    return;
  }
  const serverQuery = {
    address: address,
    port: port,
    addressType: addressType,
    fd: fd,
    flags: 0
  };

 // 是fork 出来的进程，获取master上的handel,并且监听，
 // 现在是不是很好奇_getServer方法做了什么
  cluster._getServer(server, serverQuery, listenOnMasterHandle);
}
  ...

```
答案很快就可以通过cluster._getServer 这个函数找到
*  代理了server._listen2 这个方法在work进程的执行操作
*  向master发送queryServer消息，向master注册一个内部TCP服务器
```
// lib/internal/cluster/child.js
cluster._getServer = function(obj, options, cb) {
 // ...
  const message = util._extend({
    act: 'queryServer',   // 关键点：构建一个queryServer的消息
    index: indexes[indexesKey],
    data: null
  }, options);

  message.address = address;

// 发送queryServer消息给master进程，master 在收到这个消息后，会创建一个开始一个server，并且listen
  send(message, (reply, handle) => {
      rr(reply, indexesKey, cb);              // Round-robin.
  });

  obj.once('listening', () => {
    cluster.worker.state = 'listening';
    const address = obj.address();
    message.act = 'listening';
    message.port = address && address.port || options.port;
    send(message);
  });
};
 //...
 // Round-robin. Master distributes handles across workers.
function rr(message, indexesKey, cb) {
    if (message.errno) return cb(message.errno, null);
    var key = message.key;
    //  这里hack 了listen方法
    // 子进程调用的listen方法，就是这个，直接返回0，所以不会报端口被占用的错误
    function listen(backlog) {
        return 0;
    }
    // ...
    const handle = { close, listen, ref: noop, unref: noop };
    handles[key] = handle;
    // 这个cb 函数是net.js 中的listenOnMasterHandle 方法
    cb(0, handle);
}
// lib/net.js
/*
function listenOnMasterHandle(err, handle) {
    err = checkBindError(err, port, handle);
    server._handle = handle;
    // _listen2 函数中,调用的handle.listen方法，也就是上面被hack的listen
    server._listen2(address, port, addressType, backlog, fd);
  }
*/
```
  master进程收到queryServer消息后进行启动服务
* 如果地址没被监听过，通过RoundRobinHandle监听开启服务
* 如果地址已经被监听，直接绑定handel到已经监听到服务上，去消费请求
```
// lib/internal/cluster/master.js
function queryServer(worker, message) {

    const args = [
        message.address,
        message.port,
        message.addressType,
        message.fd,
        message.index
    ];

    const key = args.join(':');
    var handle = handles[key];

    // 如果地址没被监听过，通过RoundRobinHandle监听开启服务
    if (handle === undefined) {
        var constructor = RoundRobinHandle;
        if (schedulingPolicy !== SCHED_RR ||
            message.addressType === 'udp4' ||
            message.addressType === 'udp6') {
            constructor = SharedHandle;
        }

        handles[key] = handle = new constructor(key,
            address,
            message.port,
            message.addressType,
            message.fd,
            message.flags);
    }

    // 如果地址已经被监听，直接绑定handel到已经监听到服务上，去消费请求
    // Set custom server data
    handle.add(worker, (errno, reply, handle) => {
        reply = util._extend({
            errno: errno,
            key: key,
            ack: message.seq,
            data: handles[key].data
        }, reply);

        if (errno)
            delete handles[key];  // Gives other workers a chance to retry.

        send(worker, reply, handle);
    });
}
```
看到这一步，已经很明显，我们知道了多进行端口共享的实现原理
* 其实端口仅由master进程中的内部TCP服务器监听了一次
* 因为net.js 模块中会判断当前的进程是master还是Worker进程
* 如果是Worker进程调用cluster._getServer 去hack原生的listen 方法
* 所以在child调用的listen方法，是一个return 0 的空方法，所以不会报端口占用错误

那现在问题来了，既然Worker进程是如何获取到master进程监听服务接收到的connect呢？
* 监听master进程启动的TCP服务器的connection事件
* 通过轮询挑选出一个worker
* 向其发送newconn内部消息，消息体中包含了客户端句柄
* 有了句柄，谁都知道要怎么处理了哈哈
```
// lib/internal/cluster/round_robin_handle.js

function RoundRobinHandle(key, address, port, addressType, fd) {

    this.server = net.createServer(assert.fail);

    if (fd >= 0)
        this.server.listen({ fd });
    else if (port >= 0)
        this.server.listen(port, address);
    else
        this.server.listen(address);  // UNIX socket path.

    this.server.once('listening', () => {
        this.handle = this.server._handle;
        // 监听onconnection方法
        this.handle.onconnection = (err, handle) => this.distribute(err, handle);
        this.server._handle = null;
        this.server = null;
    });
}

RoundRobinHandle.prototype.add = function (worker, send) {
    // ...
};

RoundRobinHandle.prototype.remove = function (worker) {
    // ...
};

RoundRobinHandle.prototype.distribute = function (err, handle) {
    // 负载均衡地挑选出一个worker
    this.handles.push(handle);
    const worker = this.free.shift();
    if (worker) this.handoff(worker);
};

RoundRobinHandle.prototype.handoff = function (worker) {
    const handle = this.handles.shift();
    const message = { act: 'newconn', key: this.key };
    // 向work进程其发送newconn内部消息和客户端的句柄handle
    sendHelper(worker.process, message, handle, (reply) => {
    // ...
        this.handoff(worker);
    });
};
```
下面让我们看看Worker进程接收到newconn消息后进行了哪些操作
```
// lib/child.js
function onmessage(message, handle) {
    if (message.act === 'newconn')
      onconnection(message, handle);
    else if (message.act === 'disconnect')
      _disconnect.call(worker, true);
  }

// Round-robin connection.
// 接收连接，并且处理
function onconnection(message, handle) {
  const key = message.key;
  const server = handles[key];
  const accepted = server !== undefined;

  send({ ack: message.seq, accepted });

  if (accepted)  server.onconnection(0, handle);
}
```
---
总结
* net模块会对进程进行判断，是worker 还是master, 是worker的话进行hack net.Server实例的listen方法
* worker 调用的listen 方法是hack掉的，直接return 0,不过会向master注册一个connection接手的事件
* master 收到客户端connection事件后，会轮询向worker发送connection上来的客户端句柄
* worker收到master发送过来客户端的句柄，这时候就可以处理客户端请求了

分享出于共享学习的目的，如有错误，欢迎大家留言指导，不喜勿喷。
