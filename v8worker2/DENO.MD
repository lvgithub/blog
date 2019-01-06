## Node之父ry：在“Node中的设计错误”演讲中表示：

* 不允许将任意本地函数绑定至 V8 当中。
* 所有系统调用都将通过消息传递完成（protobuf 序列化）。
* 两项原生函数：send 与 recv。
* 这既简化了设计流程，又使得系统更易于审计。

这几点很大程度上体现出了node和deno在设计本质上的区别，同时这几点体现了deno的安全性（利用 JavaScript 本身即为安全沙箱这一事实）

## V8worker2是Go和V8连接的桥梁
* 允许从GO程序执行JavaScript
* 只允许GO和V8之间的消息传递(传统：暴露C++函数作为函数在JavaScript。)
* 维护一个安全的JS沙箱
* JS中只允许绑定3个函数：$send() $recv() $print()

![deno 架构图(Parsa Ghadimi绘制) ](https://upload-images.jianshu.io/upload_images/3386947-de2356e348874b45.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
从图中可以清晰的看出,V8worker2是v8和Go之间实现调用的核心组件

![v8worker2架构图](https://upload-images.jianshu.io/upload_images/3386947-d6e2872a1bef28b8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


可以看出V8worker2 是通过binding C++ 模块进行绑定V8，bingding暴露了基础操作方法：$v8_init()  、$worker_load()、$worker_send_bytes()、$worker_dispose()...提供给GO 进行调用
```
//binding.h
const char* worker_version();
void worker_set_flags(int* argc, char** argv);
void v8_init();
worker* worker_new(int table_index);
int worker_load(worker* w, char* name_s, char* source_s);
const char* worker_last_exception(worker* w);
int worker_send_bytes(worker* w, void* data, size_t len);
void worker_dispose(worker* w);
void worker_terminate_execution(worker* w);
```
通过Golang的GC提供的CGO模块调用C语言暴露的方法,就可以实现GO和V8之间的通信了：
1. 创建一个实例：v8worker2.New(ReceiveMessageCallback)
2. 加载执行JS： worker.Load(scriptName,codeString)
```
// worker.go
package v8worker2

import "C"
...

func recvCb(buf unsafe.Pointer, buflen C.int, index workerTableIndex) C.buf {
    ...
}

func New(cb ReceiveMessageCallback) *Worker {
    ...
	initV8Once.Do(func() {
		C.v8_init()
	})
}

func (w *Worker) Load(scriptName string, code string) error {
    ...
	r := C.worker_load(w.worker.cWorker, scriptName_s, code_s)
...
}

func (w *Worker) SendBytes(msg []byte) error {
    ...
	r := C.worker_send_bytes(w.worker.cWorker, msg_p, C.size_t(len(msg)))
}
```

## 案例演示
*  实现Js中的console.log() 方法
*  Js发送数据给Go
* Go发送数据给Js
```
// hello.go
package main

import (
	"fmt"

	"github.com/ry/v8worker2"
)

func main() {
	worker := v8worker2.New(recv)

	// 实现JS的console.log 方法
	err := worker.Load("hello.js", `
		this["console"] = {
			log(...args) {
				V8Worker2.print(args)
			}
		};
		console.log("Hello World");
	`)

	if err != nil {
		fmt.Println(err)
	}

	// 发送数据给GO
	err = worker.Load("sendData.js", `
		V8Worker2.send(new ArrayBuffer(5))
	`)
	if err != nil {
		fmt.Println(err)
	}

	// 发送数据给JS
	err = worker.Load("recvData.js", `
		V8Worker2.recv(function(msg) {
			const len =msg.byteLength;
			console.log("recv data from go,length: "+len);
		});
	`)
	if err != nil {
		fmt.Println(err)
	}
	err = worker.SendBytes([]byte("abcd"))

}

func recv(buf []byte) []byte {
	fmt.Println("recv data from js,length:", len(buf))
	return nil
}
```
在控制台运行: `go run hello.go`
![运行结果](https://upload-images.jianshu.io/upload_images/3386947-a88d32e17742023e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



参考资料
* [Ryan Dahl 对 v8worker 的演讲PPT](https://docs.google.com/presentation/d/1RgGVgLuP93mPZ0lqHhm7TOpxZBI3TEdAJQZzFqeleAE/edit?usp=sharing)
* [justjavac: Deno 并不是下一代 Node.js](https://juejin.im/post/5b14a390e51d4506c1300bbc?utm_source=gold_browser_extension)
* [v8worker2 github](https://github.com/ry/v8worker2)




