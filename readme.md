

#### 1. 通过进程间发送socket的方式进行socket传递
```
    socket在进程间传递的典型应用场景见下文第2点
```
* [进程间发送socket句柄](https://github.com/lvgithub/blog/blob/master/send%20socket/readme.md)


#### 2. 端口共享机制
```
    1. node 启动多个进程的时候，会标记是master、还是child进程
    2. 当child进程启动端口监听的时候，listen函数会被hack,然后去master进程注册一个channel用于传递socket
    3. master收到socket后，以负载均衡的方式通过child注册的channel把socket发送给child 进程
    4. child 进程收到socket后，自然就可以和客户端随心所欲的恋爱了，哈哈
```
* [从Node.Js源码一步步分析，cluster 多次fork一份代码时，如何实现端口重用](https://github.com/lvgithub/blog/blob/master/cluster.md)


#### 3.实现http和https共用一个端口原理
```
1. HTTP与HTTPS都属于应用层协议，所以只要我们在底层协议中进行反向代理，
就可以解决这个问题! 因此我们可以选择底层的tcp服务进行代理！
2. https数据流的第一位是十六进制“16”，转换成十进制就是22
3. 通过数据流的第一位置，决定最终反向代理给http\https服务
4. 具体实现方案有如下三种
```
* [http和https 共用端口方案一](https://github.com/lvgithub/blog/blob/master/http%E5%92%8Chttps%20%E5%85%B1%E7%94%A8%E7%AB%AF%E5%8F%A3%E6%96%B9%E6%A1%88%2001/proxy.js)

* [http和https 共用端口方案二](https://github.com/lvgithub/blog/blob/master/http%E5%92%8Chttps%20%E5%85%B1%E7%94%A8%E7%AB%AF%E5%8F%A3%E6%96%B9%E6%A1%88%2002/proxy.js)

* [http和https 共用端口方案三](https://github.com/lvgithub/blog/blob/master/http%E5%92%8Chttps%20%E5%85%B1%E7%94%A8%E7%AB%AF%E5%8F%A3%E6%96%B9%E6%A1%88%2003/proxy.js)




