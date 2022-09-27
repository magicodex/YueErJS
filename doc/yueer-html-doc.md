
## 主要方法
```
// 注册组件
yer.registerComponent('$text', function(text) {
  this.appendBody('<p>' + text + '</p>');
});

// 创建html对象
var yerHtml = yer.html({ title: 'YueErJS' });

// 添加样式链接
yerHtml.style('/common.css');

// 添加脚本链接
yerHtml.script('/common.js');

// 添加 head 内容
yerHtml.appendHead('<meta name="description" content="支持组件化封装 HTML 代码片段">');

// 添加 body 内容
yerHtml.appendBody('<h1>YueErJS</h1>');

// 调用已注册的组件
yer.$text('Hello, YueErJS!');

// 渲染页面
var html = yerHtml.render();
```

## 使用示例

### 注册组件
```
yer.registerComponent('$form', function(opts, callback) {
  this.appendBody('<form action="' + opts.url + '" method="post">\n');
  callback();
  this.appendBody('</form>\n');
});

yer.registerComponent('$input', function(opts) {
  this.appendBody('<input type="text" name="' + opts.name +
    '" placeholder="' + opts.placeholder + '"/><br>\n');
}, {
  styles: ['input.css'],
  scripts: ['input.js']
});

yer.registerComponent('$password', function(opts) {
  this.appendBody('<input type="password" name="' + opts.name +
    '" placeholder="' + opts.placeholder + '"/><br>\n');
}, {
  dependencies: ['$input'],
  styles: ['password.css'],
  scripts: ['password.js']
});

yer.registerComponent('$submit', function(opts) {
  this.appendBody('<input type="submit" value="' + opts.label + '"/><br>\n');
}, {
  styles: ['submit.css'],
  scripts: ['submit.js']
});
```

### 生成页面
```
var yerHtml = yer.html({ title: 'YueErJS' });

yerHtml.$form({ url: '/login' }, () => {
  yerHtml.$input({
    name: 'userName',
    placeholder: '请输入用户名...'
  });

  yerHtml.$password({
    name: 'password',
    placeholder: '请输入密码...'
  });

  yerHtml.$submit({
    label: '提交'
  });
});

var html = yerHtml.render();


>>>>>>>>>> HTML代码 >>>>>>>>>>
<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>YueErJS</title>
<link rel="stylesheet" href="input.css">
<link rel="stylesheet" href="password.css">
<link rel="stylesheet" href="submit.css">
</head>
<body>
<form action="/login" method="post">
<input type="text" name="userName" placeholder="请输入用户名..."/><br>
<input type="password" name="password" placeholder="请输入密码..."/><br>
<input type="submit" value="提交"/><br>
</form>
<script src="input.js"></script>
<script src="password.js"></script>
<script src="submit.js"></script>
</body>
</html>
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
```
