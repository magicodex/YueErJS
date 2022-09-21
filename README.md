# YueErJS

## 示例代码

### 定义组件
```
yer.component('$Jumbotron', function(opts) {
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
var yerHtml = yer.html();
yerHtml.$Jumbotron({ title : 'Welcome', content: 'Hello, world!' });
var html = yerHtml.html();
```

## 开源协议
MIT
