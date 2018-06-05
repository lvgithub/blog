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
