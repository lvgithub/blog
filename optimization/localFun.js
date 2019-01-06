const test = () => {
    const add = (x, y) => {
        return x + y;
    }

    let result = 0;
    for (let i = 0; i < 10000000; ++i) {
        add(1, 2)
    }
    return result;
}

for (let i = 1; i <= 10; ++i) {
    console.time("local function:" + i);
    test();
    console.timeEnd("local function:" + i);
}