

## 本案例演示如何把 socket 发送给另外一个进程


* 接收socket,然后发送socket句柄发送给子进程

```
// main.js
'use strict'

const net = require('net');
const cluster = require('cluster');
const cp = require('child_process');
const numCPUs = require('os').cpus().length;

const n = cp.fork(`./socket/sub.js`);

n.on('message', (m) => {
    console.log('Main got message:', m);
});


/**
 * pauseOnConnect:true 当收到连接的时候，会暂停socket 流的操作，只有通过socket.resume()操作才能进行接收数据
 * 进行socket句柄发送个子进程的操作时，设置此选项可以保证子进程收到的收据完整性
 * 
 */
net
    .createServer({ pauseOnConnect: true }, socket => {
        n.send('socket', socket);
        // pauseOnConnect: true 时本进程也会触发data 事件
        socket.on('data', chunk => console.log('work', chunk))
    })
    .listen({ port: 8010, exclusive: false });

```

* 子进程收到socket后,开始接收数据

```
 // sub.js
'use strict'

process.on('message', (m, socket) => {
    console.log('CHILD got message:', m);

    socket.resume();
    socket.on('data', chunk => console.log('child', chunk))
});

process.on('socket', (m) => {
    console.log('CHILD got message:', m);
    console.log(m)
});

process.send({ foo: 'bar', baz: NaN });
```