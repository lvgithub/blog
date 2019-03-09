
让浏览器加载Nodejs模块

Browserify,允许你使用require('modules')的模块依赖，在浏览器中使用

使用案例
```
<!-- step1: -->
const unique = require('uniq');
const data = [1, 2, 2, 3, 4, 5, 5, 5, 6];
console.log(unique(data));

<!-- step2 -->
browserify main.js -o bundle.js

<!-- step3 -->
<script src="bundle.js"></script>
```

nodejs内置模块的转换
* 理想情况下，大部分不涉及io操作的模块可以在浏览器中直接运行
* 对于nodejs内置模块，在require()它们的时候，会被转换成为适配浏览器环境的npm包,具体转换map,参考[Browserify 使用指南](https://zhaoda.net/2015/10/16/browserify-guide/)

参考
* [Browserify 使用指南](https://zhaoda.net/2015/10/16/browserify-guide/)