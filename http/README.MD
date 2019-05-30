HTTP 重点知识积累

Cookie
*  默认情况下浏览器对跨域请求不会携带 Cookie
*  但鉴于 Cookie 在身份验证等方面的重要性， CORS 推荐使用额外的响应头字段来允许跨域发送 Cookie
    * 目标服务器,设置Access-Control-Allow-Credentials=true,支持跨域请求携带Cookie
    * 自从用了Access-Control-Allow-Credentials: true，就不能设置Access-Control-Allow-Origin:'*'
    * 设置Access-Control-Allow-Origin=<domain>
        ```
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.withCredentials = true;
        xhr.send();
        ```
* HttpOnly:是包含在Set-Cookie HTTP响应头文件中的附加标志。生成的cookie无法被javascript访问到。


Storage
*  Web storage API
    * sessionStorage 为每一个给定的源（given origin）维持一个独立的存储区域，该存储区域在页面会话期间可用
    * localStorage 同样的功能，但是在浏览器关闭，然后重新打开后数据仍然存在
*  IndexedDB 
    * 用于客户端存储大量结构化数据(包括, 文件/ blobs)，对于存储更大量的结构化数据来说，使用IndexedDB是一个更合适的方案

[Service Worker](https://zhuanlan.zhihu.com/p/28399762)
* 它是一种 JavaScript Worker，无法直接访问 DOM。 Service Worker 通过响应 postMessage 接口发送的消息来与其控制的页面通信，页面可在必要时对 DOM 执行操作。
* Service Worker 是一种可编程网络代理，让您能够控制页面所发送网络请求的处理方式。
* Service Worker 在不用时会被中止，并在下次有需要时重启，因此，您不能依赖 Service Worker onfetch 和 onmessage 处理程序中的全局状态。 如果存在您需要持续保存并在重启后加以重用的信息，Service Worker 可以访问 IndexedDB API。
* Service Worker 广泛地利用了 promise，因此如果您不熟悉 promise，则应停下阅读此内容，看一看 Promise 简介。