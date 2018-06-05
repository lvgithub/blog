
在你需要运行代码前需要先下载依赖
```
go get -u github.com/ry/v8worker2
cd $GOPATH/src/github.com/ry/v8worker2
./build.py --use_ccache
```

如果发生错误你需要进行如下操作
```
`git submodule update --init` in the v8worker2 dir.
`sudo apt-get install libgtk-3-dev pkg-config ccache` on ubuntu
`sudo yum install libgtk-3-dev pkg-config ccache` on centos
`sudo brew install libgtk-3-dev pkg-config ccache` on macOS
```

运行案例：
```
go run hello.go
```