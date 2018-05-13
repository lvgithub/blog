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



