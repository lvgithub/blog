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