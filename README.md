# YueErJS
组件化生成 HTML 代码。

![月儿](https://github.com/magicodex/YueErJS/blob/main/logo.png "月儿")

## 安装依赖
```
npm install --save-dev yueerjs
```

## 示例代码

### 定义组件
```
var yer = require('yueerjs');

yer.component('$jumbotron', function(opts) {
  this.appendBody('<div class="jumbotron jumbotron-fluid">\n');
  this.appendBody('<div class="container">\n');
  this.appendBody('<h1 class="display-4">' + opts.title + '</h1>\n');
  this.appendBody('<p class="lead">' + opts.content + '</p>\n');
  this.appendBody('</div>\n</div>\n');
}, {
  styles: ['/js/bootstrap.css']
});
```

### 生成页面
```
var yer = require('yueerjs');

var yerHtml = yer.html();
yerHtml.$jumbotron({ title : 'Welcome', content: 'Hello, world!' });
var html = yerHtml.render();

console.info(html);

>>>>>>>>>> HTML代码 >>>>>>>>>>
<!doctype html>
<html lang="zh-CN">
<head>
<link rel="stylesheet" href="/js/bootstrap.css">
</head>
<body>
<div class="jumbotron jumbotron-fluid">
<div class="container">
<h1 class="display-4">Welcome</h1>
<p class="lead">Hello, world!</p>
</div>
</div>
</body>
</html>
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
```

## 开源协议
MIT
