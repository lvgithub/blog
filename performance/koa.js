const Koa = require('koa');
const sleep = require('sleep');
const app = new Koa();


function fb1(n) {
    if (n <= 2) {
        return 1;
    } else {
        return fb1(n - 1) + fb1(n - 2);
    }
}

// console.time(1)
// fb1(43);
// console.timeEnd(1)
// const sleep = time => {
//     return new Promise((r, j) => {
//         setTimeout(() => {
//             r('');
//         }, time)
//     })
// }

app.use(async ctx => {
    console.log(new Date().getTime())
    // sleep.sleep(1);
    fb1(43);
    ctx.body = 'Hello World';
});

app.listen(3000);
// while (true) { }