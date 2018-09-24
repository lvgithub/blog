function shape(x, y) {
    this.x = x;
    this.y = y;

    this.perimeter = function () {
        return (this.x + this.y) * 2;
    }
}
let a = new shape(1, 3);
const test = a => {

    let result = 0;
    for (let i = 0; i < 10000000; ++i) {
        a.perimeter(1, 2)
    }
    return result;
}

for (let i = 1; i <= 10; ++i) {
    console.time("time:" + i);
    test(a);
    console.timeEnd("time:" + i);
}