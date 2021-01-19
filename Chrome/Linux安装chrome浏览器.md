#! https://zhuanlan.zhihu.com/p/344848466

# Linux安装chrome浏览器

## 脚本安装
```
curl https://intoli.com/install-google-chrome.sh | bash
```

## 通用安装
* 换源  
```
cat /etc/redhat-release
```
修改内容为
```
[google-chrome]
name=google-chrome
baseurl=http://dl.google.com/linux/chrome/rpm/stable/$basearch
enabled=1
gpgcheck=1 
gpgkey=https://dl-ssl.google.com/linux/linux_signing_key.pub
```
* 执行命令
```
sudo yum install google-chrome-stable
```

* 在安装 Chrome 浏览器时如果提示如下错误信息：
```
[Errno 14] curl#7 - "Failed connect to dl-ssl.google.com:443; Operation now in progress"
```
说明无法下载 GPG 秘钥信息，可以在 Yum 软件源信息中配置不检查秘钥信息，把 Yum 软件源信息修改为如下内容：
```
[google-chrome]
name=google-chrome
baseurl=http://dl.google.com/linux/chrome/rpm/stable/$basearch
enabled=1
gpgcheck=0
gpgkey=https://dl-ssl.google.com/linux/linux_signing_key.pub
```

## 参考
* https://intoli.com/blog/installing-google-chrome-on-centos/
* 