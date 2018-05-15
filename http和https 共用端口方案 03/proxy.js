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

