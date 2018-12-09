

#### 1. [进程间发送socket句柄](https://github.com/lvgithub/blog/blob/61d0351a9477c546099d116dfb9d45d4af1eae0f/%E8%BF%9B%E7%A8%8B%E9%97%B4%E5%8F%91%E9%80%81socket/readme.md)
```
    socket在进程间传递的典型应用场景见下文第2点
```

#### 2. [从Node.Js源码一步步分析，cluster 多次fork一份代码时，如何实现端口重用](https://github.com/lvgithub/blog/blob/master/cluster.md)
```
    1. node 启动多个进程的时候，会标记是master、还是child进程
    2. 当child进程启动端口监听的时候，listen函数会被hack,然后去master进程注册一个channel用于传递socket
    3. master收到socket后，以负载均衡的方式通过child注册的channel把socket发送给child 进程
    4. child 进程收到socket后，自然就可以和客户端随心所欲的恋爱了，哈哈
```


#### 3. [http和https 共用端口方案](https://github.com/lvgithub/blog/blob/master/http%E5%92%8Chttps%20%E5%85%B1%E7%94%A8%E7%AB%AF%E5%8F%A3%E6%96%B9%E6%A1%88%2001/proxy.js)
```
    1. HTTP与HTTPS都属于应用层协议，所以只要我们在底层协议中进行反向代理，
    就可以解决这个问题! 因此我们可以选择底层的tcp服务进行代理！
    2. https数据流的第一位是十六进制“16”，转换成十进制就是22
    3. 通过数据流的第一位置，决定最终反向代理给http\https服务
    4. 具体实现方案有如下三种,见git http和https...文件夹
```

#### 4. [Deno原理详解，让我们一起从源码分析开始](https://github.com/lvgithub/blog/blob/master/v8worker2/Deno%E5%8E%9F%E7%90%86%E8%AF%A6%E8%A7%A3%EF%BC%8C%E8%AE%A9%E6%88%91%E4%BB%AC%E4%B8%80%E8%B5%B7%E4%BB%8E%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90%E5%BC%80%E5%A7%8B.md)
#### 5. [js性能优化-相同的代码放到不同的地方居然有这么大的性能差异!](https://juejin.im/post/5ba88cdee51d450e6a2e1b9e)

#### 6. [V8引擎之代码被反优化了](https://juejin.im/post/5ba8a0665188255c8d0fcb65)

#### 7. [避免尝试访问undefined变量的属性报错，使用get-value](https://github.com/lvgithub/blog/blob/master/getValue/index.js)





