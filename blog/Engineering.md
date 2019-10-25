一段代码，证明你是合格的工程师，不是码农

同样实现一个功能，不同人的实现差千里。老规矩，脱离业务场景的讨论都是无用的，所以我们先约定下业务场景：  

PM同学，跑来给你捶背，按摩的求你给商城首页新增一个活动信息展示的需求。

A同学，刚毕业，非常积极，这个不就是调用一下接口，把活动信息展示出来不就可以了，主动找PM小姐姐把活给接过来了。然后写了如下代码：
首先定义了一个获取活动信息的方法:
```
const getActivityInfo = ()=>{
  return request.post(url,body);
}
```
然后在业务层调用
```
//...原始首页业务逻辑...

const info = await getActivityInfo();
showActivety(info);

//...原始首页业务逻辑...
```
就这样很快的完成了功能，提测上线了，得到了PM小姐姐的表扬。
但是好景不长，一天做活动，流量激增，后端获取服务的接口挂了，getActivityInfo 方法抛出了异常，直接中断了原始的业务逻辑，整个页面挂了。PM小姐姐很生气的过来，问：只是活动系统挂了而已，怎么现在整个页面都挂了。被谴责一番，但是还好没泄气，请教了身边工作一年的同事B，然后告诉他，你这要处理异常，避免这种非核心业务挂了，影响了核心的业务。咣咣咣，很快优化了逻辑：
```
//...原始业务逻辑...

try {
    const info = await getActivityInfo();
    showActivety(info);
} catch (error) {
    console.error('活动系统服务异常!');
}

//...原始业务逻辑...
```
很快，又上线了，A开心的继续工作。过了一段时间，PM小姐姐又气哄哄的跑了过来，怎么回事，刚推广做活动，现在网页加载好慢。很快查出了问题，由于访问量过大，getActivityInfo 服务响应过慢，直接影响了核心业务的响应速度。于是A同学又请教了一个经验比较足的同事，告诉了他解决方法：
```
try {
    const info = await Promise.race([
        getActivityInfo(),
        new Promise((resolve, reject) => {
            // 后端服务，响应过慢，超时100ms熔断
            const timeOutMs = 100;
            setTimeout(() => {
                resolve({});
            }, timeOutMs);
        })
    ]);;
    showActivety(info);
} catch (error) {
    console.error('活动系统服务异常!');
}
```
这次好了，加了熔断机制，非核心业务如果响应过慢，直接放弃，保障核心业务需求。很开心的又提测了，但是这次经理不放心了，过来 Review 代码，一看不满意，这代码以后怎么维护，每个地方调用活动信息的时候，都得增超时机制，多麻烦，于是指点一二：
```
const getActivityInfo = () => {
    try {
        const info = await Promise.race([
            request.post(url, body),
            new Promise((resolve, reject) => {
                // 后端服务，响应过慢，超时100ms熔断
                const timeOutMs = 100;
                setTimeout(() => {
                    resolve({});
                }, timeOutMs);
            })
        ]);
        return info;
    } catch (error) {
        console.error('活动系统服务异常!');
        return {};
    }
}

//...原始业务逻辑...
const info = await getActivityInfo();
showActivety(info);
//...原始业务逻辑...
```
这次业务代码一下工整了，少了try catch,同时，以后在别处调用活动信息的时候，就不需要再考虑各种异常情况处理了。

同学A：我好难...