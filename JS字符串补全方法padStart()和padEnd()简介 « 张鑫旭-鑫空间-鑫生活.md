# JS字符串补全方法padStart()和padEnd()简介 « 张鑫旭-鑫空间-鑫生活
这篇文章发布于 2018 年 07 月 24 日，星期二，00:29，归类于 [JS API](https://www.zhangxinxu.com/wordpress/category/js/js-api/)。 阅读 28785 次, 今日 19 次 [17 条评论](#comments)

by [zhangxinxu](https://www.zhangxinxu.com/) from [https://www.zhangxinxu.com/wordpress/?p=7826](https://www.zhangxinxu.com/wordpress/?p=7826)  
本文可全文转载，但需要保留原作者和出处。

### 一、关于字符串补全

![](https://image.zhangxinxu.com/image/blog/201807/7826-thumb.png)

在 JS 中，字符串补全是常用操作，用的比较多的就是时间或者日期前面的补`0`。

例如，日期，我们多采用 4-2-2 的表示形式，例如：

2018-07-23

当我们使用时间戳进行月份获取的时候，是没有前面的`0`的，例如：

var month = new Date().getMonth() + 1;    // 结果是 7

![](https://image.zhangxinxu.com/image/blog/201807/2018-07-23_212330.png)

此时，就需要进行补全，通常做法是这样：

if (month &lt; 10) {
    month = '0' + month;
}

甚至会专门定义一个补`'0'`方法，例如此[日期转时间戳微码](https://www.zhangxinxu.com/php/microCodeDetail?id=10)中的自定义的`zero`方法。

![](https://image.zhangxinxu.com/image/blog/201807/2018-07-23_213135.png)

然而，随着 JS 字符串补全方法`padStart()`和`padEnd()`的出现，类似场景使用就简单多了！

### 二、关于 padStart

`padStart`可以在字符串的开头进行字符补全。

语法如下：

str.padStart(targetLength \[, padString])

其中：

**targetLength** （可选）

`targetLength`指目标字符串长度。

然后，根据我的测试，`targetLength`参数缺省也不会报错，原本的字符串原封不动返回，不过代码没有任何意义，因此，基本上没有使用的理由。

还有，`targetLength`参数的类型可以是数值类型或者弱数值类型。在 JavaScript 中，`1 == '1'`，`1`是数值，`'1'`虽然本质上是字符串，但也可以看成是弱数值。在`padStart()`方法中，数值类型或者弱数值类型都是可以。例如：

'zhangxinxu'.padStart('5');

因此，我们实际使用的时候，没必要对`targetLength`参数进行强制的类型转换。

最后，如果`targetLength`设置的长度比字符串本身还要小，则原本的字符串原封不动返回，例如：

'zhangxinxu'.padStart(5);  
// 结果还是'zhangxinxu'

**padString** （可选）

`padString`表示用来补全长度的字符串。然而，虽然语义上是字符串，但是根据我的测试，任意类型的值都是可以的。无论是 Chrome 浏览器还是 Firefox 浏览器，都会尝试将这个参数转换成字符串进行补全。例如下面几个例子：

'zhangxinxu'.padStart(15, false);
// 结果是'falsezhangxinxu'

'zhangxinxu'.padStart(15, null);
// 结果是'nullnzhangxinxu'

'zhangxinxu'.padStart(15, \[]);
// 结果是'zhangxinxu'，因为\[]转换成字符串是空字符串

'zhangxinxu'.padStart(15, {});
// 结果是'\[objezhangxinxu'，只显示了'\[object Object]'前 5 个字符

`padString`参数默认值是普通空格`' '`（U+0020），也就是敲 Space 空格键出现的空格。

从上面几个案例可以看出，如果补全字符串长度不足，则不断循环补全；如果长度超出，则从左侧开始依次补全，没有补到的字符串直接就忽略。

此方法返回值是补全后的字符串。

回到一开始的日期补`'0'`功能，有了`padStart()`方法，我们代码可以简化成下面这一行：

var month = String(new Date().getMonth() + 1).padStart(2, '0');    // 结果是'07'

**兼容性**

IE14 以其已下浏览器都不支持，考虑到现在还是 windows 7 天下，PC 端对外项目还不能直接用；移动端，UC 浏览器，QQ 浏览器也不支持。但是，也不是不能使用，加一个 Polyfill 就好了，这个后面会展示。

### 三、关于 padEnd

`padEnd`可以在字符串的后面进行字符补全，语法参数等都和`padStart`类似。

语法：

str.padEnd(targetLength \[, padString])

其中：

**targetLength** （可选）

`targetLength`指补全后字符串的长度。

然后，根据我的测试，`targetLength`参数如果不设置，不会报错，直接返回原始字符串，不过这样代码就没有任何意义，因此，实际开发，此参数肯定是需要设置的。

同样的，`targetLength`参数的类型可以是数值类型或者弱数值类型。例如下面 2 个用法都是可以的：

'zhangxinxu'.padEnd('15');
'zhangxinxu'.padEnd(15);

因此，我们实际写代码的时候，没必要强制`targetLength`参数为数值。

最后，如果`targetLength`设置的长度比字符串本身还要小，则原字符串原封不动返回，例如：

'zhangxinxu'.padEnd(5);  
// 结果还是'zhangxinxu'

如果`targetLength`是一些乱七八糟的数值类型，也是返回原始字符串。例如：

'zhangxinxu'.padEnd(false);  
// 结果还是'zhangxinxu'

但是有意义吗？没意义，所以不要这么用。

**padString** （可选）

`padString`表示用来补全长度的字符串。虽然语义上是字符串，实际上这个参数可以是各种类型。例如下面几个例子：

'zhangxinxu'.padEnd(15, false);
// 结果是'zhangxinxufalse'

'zhangxinxu'.padEnd(15, null);
// 结果是'zhangxinxunulln'

'zhangxinxu'.padEnd(15, \[]);
// 结果是'zhangxinxu'，因为\[]转换成字符串是空字符串

'zhangxinxu'.padEnd(15, {});
// 结果是'zhangxinxu\[obje'，只显示了'\[object Object]'前 5 个字符

从上面几个案例可以看出，如果补全字符串长度不足，则从左往右不断循环补全；如果长度超出可以补全的字符长度，则从左侧尽可能补全，补不到的没办法，只能忽略，例如`'zhangxinxu'.padEnd(15, {})`等同于执行`'zhangxinxu'.padEnd(15, '[object Object]')`，最多只能补 5 个字符，因此，只能补`'[object Object]'`前 5 个字符，于是最后结果是：`'zhangxinxu[obje'`。

`padString`参数如果不设置，则会使用普通空格`' '`（U+0020）代替，也就是 Space 空格键敲出来的那个空格。

**举一个在后面补全字符串案例**  
在 JS 前端我们处理时间戳的时候单位都是`ms`毫秒，但是，后端同学返回的时间戳则不一样是毫秒，可能只有 10 位，以`s`秒为单位。所以，我们在前端处理这个时间戳的时候，保险起见，要先做一个 13 位的补全，保证单位是毫秒。使用示意：

timestamp = +String(timestamp).padEnd(13, '0');

**兼容性**

本字符串 API 属于 ES6 新增方法，IE14 以其已下浏览器都不支持，部分国产移动端浏览器也不支持。目前对外项目使用还需要附上 Polyfill 代码。

### 四、Polyfill 代码

以下 Polyfill 代码取自 polyfill 项目中的 string.polyfill.js，其中使用依赖的`repeat()`也是 ES6 新增方法，因此，完成 Polyfill 代码如下，注释部分我做了简单的翻译，代码部分简化了些许逻辑，同时，**修复了一个 bug**，下面代码红色高亮部分就是修复内容：

// [https://github.com/uxitten/polyfill/blob/master/string.polyfill.js](https://github.com/uxitten/polyfill/blob/master/string.polyfill.js)
// repeat() 方法的 polyfill
if (!String.prototype.repeat) {
    String.prototype.repeat = function (count) {
        'use strict';
        if (this == null) {
            throw new TypeError('can\\'t convert' + this + 'to object');
        }
        var str = '' + this;
        count = +count;
        if (count != count) {
            count = 0;
        }
        if (count &lt; 0) {
            throw new RangeError('repeat count must be non-negative');
        }
        if (count == Infinity) {
            throw new RangeError('repeat count must be less than infinity');
        }
        count = Math.floor(count);
        if (str.length == 0 || count == 0) {
            return '';
        }
        if (str.length \* count >= 1 &lt;&lt;28) {
            throw new RangeError('repeat count must not overflow maximum string size');
        }
        var rpt = '';
        for (; ;) {
            if ((count & 1) == 1) {
                rpt += str;
            }
            count >>>= 1;
            if (count == 0) {
                break;
            }
            str += str;
        }
        return rpt;
    }
}
// padStart() 方法的 polyfill
if (!String.prototype.padStart) {
    String.prototype.padStart = function (targetLength, padString) {
        // 截断数字或将非数字转换为 0
        targetLength = targetLength>>0; 
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength || padString === '') {
            return String(this);
        }
        targetLength = targetLength-this.length;
        if (targetLength > padString.length) {
            // 添加到初始值以确保长度足够
            padString += padString.repeat(targetLength / padString.length); 
        }
        return padString.slice(0, targetLength) + String(this);
    };
}
// padEnd() 方法的 polyfill
if (!String.prototype.padEnd) {
    String.prototype.padEnd = function (targetLength, padString) {
        // 转数值或者非数值转换成 0
        targetLength = targetLength >> 0; 
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength || padString === '') {
            return String(this);
        }
        targetLength = targetLength - this.length;
        if (targetLength > padString.length) {
            // 添加到初始值以确保长度足够
            padString += padString.repeat(targetLength / padString.length);
        }
        return String(this) + padString.slice(0, targetLength);
    };
}

以上 polyfill 代码需要放在调用`padStart()`/`padEnd()`方法的代码的前面，只要在合适的位置就这么一粘贴，然后，无论什么版本浏览器浏览器，哪怕 IE6，IE8，我们也可以放心使用`padStart()`或者`padEnd()`方法了。

**polyfill 代码下的 demo 案例**

您可以狠狠地点击这里：[padStart 和 padEnd 方法 polyfill 测试 demo](https://www.zhangxinxu.com/study/201807/padstart-padend-polyfill-demo.php)

原 polyfill 方法的一个 bug 就是通过这个测试 demo 测出来的，下面是修正后的 polyfill 代码在 IE9 浏览器的测试结果截图：

![](https://image.zhangxinxu.com/image/blog/201807/2018-07-24_001136.png)

### 五、结语

标题虽然是简介，但是本文内容实际上已经非常深入细节了。`padStart()`和`padEnd()`两个方法参数容错性非常强，非常有 JS 的特色，我很喜欢。但是，也带来另外的问题，就是，如果我们的参数值因为各种原因，最后并不是我们期望的参数值，则很可能会产生非常隐蔽的 bug，因为不会报错啊，运行还是正常的。所以，容错性强，也算是有利有弊。

ES6 对字符串还扩展了很多其他方法，除了本文提到的`repeat()`方法，还有诸如`normalize()`，`trimStart()`，`trimEnd()`等 API 方法。这些之后再一个一个深入细节。

话说，我现在才开始深入学习 ES6 的基础知识应该还不算晚吧，哈哈！

![](https://image.zhangxinxu.com/image/emtion/laugh.gif)

（本篇完） ![](https://image.zhangxinxu.com/image/emtion/emoji/1f44d.svg)
 是不是学到了很多？可以分享到微信！  
![](https://image.zhangxinxu.com/image/emtion/emoji/1f44a.svg)
 有话要说？点击[这里](#comment "点击定位到评论")。

本文为原创文章，会经常更新知识点以及修正一些错误，因此转载请保留原出处，方便溯源，避免陈旧错误知识的误导，同时有更好的阅读体验。  
本文地址：[https://www.zhangxinxu.com/wordpress/?p=7826](https://www.zhangxinxu.com/wordpress/?p=7826)

![](https://www.zhangxinxu.com/php/qrcode/index.php?data=https://www.zhangxinxu.com/wordpress/2018/07/js-padstart-padend/&size=20) 
 [https://www.zhangxinxu.com/wordpress/2018/07/js-padstart-padend/](https://www.zhangxinxu.com/wordpress/2018/07/js-padstart-padend/)
