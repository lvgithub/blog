

1. HTTP与HTTPS都属于应用层协议，所以只要我们在底层协议中进行反向代理，
    就可以解决这个问题! 因此我们可以选择底层的tcp服务进行代理！
2. https数据流的第一位是十六进制“16”，转换成十进制就是22
3. 通过数据流的第一位置，决定最终反向代理给http\https服务
4. 具体实现方案有如下三种,见git http和https...文件夹


* 方案一
``` javascript
'use strict';

const net = require('net');
const http = require('http');
const https = require('https');

net.createServer(socket => {
    socket.once('data', buffer => {
        socket.pause();

        let protocol;
        const byte = buffer[0];

        if (byte === 22) {
            protocol = 'https';
        } else if (32 < byte && byte < 127) {
            protocol = 'http';
        }

        const proxy = protocol === 'http' ? net.createConnection(8081, () => {
            console.log('httpProxy connected to server!')
        }) : net.createConnection(443, () => {
            console.log('httpsProxy connected to server!')
        })

        if (proxy) {
            // 把数据包丢回流的头部
            socket.unshift(buffer);
            socket.pipe(proxy).pipe(socket);
            socket.resume();
            return;
        }

        socket.end();
    });
}).listen(8080);


http.createServer((req, res) => {
    req.on('data', chunk => {
        console.log('chunk length:', chunk.length);
    })
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('okay');
}).listen(8081);

```

* 方案二
``` javascript
'use strict';

const net = require('net');
const http = require('http');
const https = require('https');

const server = {};
server.http = http.createServer(handler);
server.https = https.createServer(opts, handler);

net.createServer(socket => {
    socket.once('data', buffer => {
        socket.pause();

        let protocol;
        const byte = buffer[0];

        if (byte === 22)
            protocol = 'https';
        else if (32 < byte && byte < 127)
            protocol = 'http';
        else
            return;

        const proxy = server[protocol];
        if (proxy) {
            socket.unshift(buffer);
            proxy.emit('connection', socket);
        }

        socket.resume();
    });
}).listen(2081);




```

* 方案三
``` javascript
'use strict';

const net = require('net');
const http = require('http');
const https = require('https');

net.createServer(socket => {
    socket.once('data', buffer => {
        let protocol;
        const byte = buffer[0];

        if (byte === 22) {
            protocol = 'https';
        } else if (32 < byte && byte < 127) {
            protocol = 'http';
        } else
            return;

        const proxy = protocol === 'http' ? net.createConnection(8081, () => {
            console.log('httpProxy connected to server!')
        }) : net.createConnection(443, () => {
            console.log('httpsProxy connected to server!')
        })

        if (proxy) {
            if (!proxy.write(buffer));
            socket.pause();

            socket.pipe(proxy).pipe(socket);
            socket.resume();
            return;
        }

        socket.end();
    });

    socket.on('drain', () => {
        socket.resume();
    })
}).listen(8080);


http.createServer((req, res) => {
    req.on('data', chunk => {
        console.log('chunk length:', chunk.length);
    })
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('okay');
}).listen(8081);


```