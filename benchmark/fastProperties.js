const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

const properties = {
    aaaaaa: '100',
    bbbbbb: '100',
    cccccc: '100',
    dddddd: '100',
    eeeeee: '100'
}
const elements = {
    1: '100',
    2: '100',
    3: '100',
    4: '100',
    5: '100'
}
suite
    .add('properties#test', function () {
        const a = properties.aaaaaa
        const b = properties.bbbbbb
        const c = properties.cccccc
        const d = properties.dddddd
        const e = properties.eeeeeee
    })
    .add('elements#test', function () {
        const a = properties[1]
        const b = properties[2]
        const c = properties[3]
        const d = properties[4]
        const e = properties[5]
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run({ 'async': true });