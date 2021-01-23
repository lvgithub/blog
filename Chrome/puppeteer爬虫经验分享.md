#! https://zhuanlan.zhihu.com/p/346016114
# puppeteer爬虫经验分享


## 为什么puppeter v.XXX不能与Chromium v.YYY一起工作？
puppeter的版本是一一对应的需要和对应版本的Chromium一起工作
历史版本下载地址：https://www.slimjet.com/chrome/google-chrome-old-version.php

## 被识别为爬虫
* 不使用chromium，使用浏览器
```
 Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
 });
```

## 