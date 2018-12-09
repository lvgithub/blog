const Benchmark = require('benchmark');
const get = require('get-value');

const suite = new Benchmark.Suite;
const obj = { a: { b: { c: { d: 'foo' } } } };
get(obj, 'a.b.c.d')

suite
    .add('get-value#get', function () {
        get(obj, 'a.b.c.d');
    })
    .add('Object#get', function () {
        obj.a && obj.a.b && obj.a.b.c && obj.a.b.c.d;
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run({ 'async': true });