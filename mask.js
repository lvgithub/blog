let a = "京A193X9".split('')

const len = a.length;
const replaceData = new Array(len - 2).fill('*');
a.splice(2, len - 2, ...replaceData)



const license = '京A193X9';
const licenseLen = license.length;
const reg = new RegExp(`([\u4e00-\u9fa5_a-zA-Z0-9]{2})[\u4e00-\u9fa5_a-zA-Z0-9]{${licenseLen - 2}}`);
const mask = license.replace(reg, "$1" + new Array(licenseLen - 2).fill('*').join(''));

// console.log('mask:', mask);

// const mask2 = license.replace(/[\u4e00-\u9fa5_a-zA-Z0-9]*/, item => item.replace(/[\u4e00-\u9fa5_a-zA-Z0-9]/g, '*'));

const mask2 = '京A193X9'.replace(/([\u4e00-\u9fa5_a-zA-Z0-9]{2})[\u4e00-\u9fa5_a-zA-Z0-9]*/g, (item1, item2) => {
    return item2 + item1.replace(/[\u4e00-\u9fa5_a-zA-Z0-9]/g, '*').substring(2)
})

console.log('mask2:', mask2);
