const Promise = require('bluebird');

const timeOut = ms => new Promise(resolve => {
    setTimeout(resolve.bind(this, ms), ms);
})

const race = (pList) => {
    return new Promise((reject, resolve) => {
        for (const val of pList) {
            val
                .then((ret) => reject(ret))
                .catch((err) => resolve(err))
        }
    });
}

race([timeOut(3000), timeOut(4000), timeOut(1000)]).then((ret) => {
    console.log(ret);
})