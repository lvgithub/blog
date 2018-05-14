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



