const fs = require('fs');

fs.readFile('testFile0.txt', function (err, data) {
    console.log(new Date().toLocaleTimeString() + '  data read of testFile0.txt');

    // 模拟CPU密集型任务
    computing()
});

fs.readFile('testFile1.txt', function (err, data) {
    console.log(new Date().toLocaleTimeString() + '  data read of testFile1.txt');

    // 模拟CPU密集型任务
    computing()
});

// CPU密集型任务
function computing() {
    for (let i = 0; i < 10000; i++)//
    {
        for (let j = 0; j < 10000; j++) {
            for (let k = 0; k < 100; k++) { }
        }
    }
}

// console.time(1)
// computing()
// console.timeEnd(1)