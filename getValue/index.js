const get = require('get-value');
const obj = { a: { b: { c: { d: 'foo' } } } };

console.log(get(obj, 'a.v.g.g')); //=> 'undefined'

console.time('get opts:100000')
for (let i = 1; i < 100000; i++) {
    obj.a && obj.a.b && obj.a.b.c && obj.a.b.c.d
}
console.timeEnd('get opts:100000')

console.time('get-value opts:100000')
for (let i = 1; i < 100000; i++) {
    get(obj, 'a.b.c.d')
}
console.timeEnd('get-value opts:100000')


