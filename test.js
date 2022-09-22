'use strict'

var assert = require('assert');
var yer = require('./index');

//
// 定义组件
//

yer.component('$form', function(opts, callback) {
  this.appendBody('<form action="' + opts.url + '" method="post">\n');
  callback();
  this.appendBody('</form>\n');
});

yer.component('$input', function(opts) {
  this.appendBody('<input type="text" name="' + opts.name +
    '" placeholder="' + opts.placeholder + '"/><br>\n');
}, {
  styles: ['input.css'],
  scripts: ['input.js']
});

yer.component('$submit', function(opts) {
  this.appendBody('<input type="submit" value="' + opts.label + '"/><br>\n');
}, {
  dependencies: ['$input'],
  styles: ['submit.css'],
  scripts: ['submit.js']
});

//
// 生成页面
//

var yerHtml = yer.html();

yerHtml.$form({url: '/test'}, () => {
  yerHtml.$input({
    name: 'code',
    placeholder: '请输入代码...'
  });

  yerHtml.$input({
    name: 'name',
    placeholder: '请输入名称...'
  });

  yerHtml.$submit({
    label: '提交'
  });
});

//
// 检查结果
//

assert.equal(yerHtml.render(),
`<!doctype html>
<html lang="zh-CN">
<head>
<link rel="stylesheet" href="input.css">
<link rel="stylesheet" href="submit.css">
</head>
<body>
<form action="/test" method="post">
<input type="text" name="code" placeholder="请输入代码..."/><br>
<input type="text" name="name" placeholder="请输入名称..."/><br>
<input type="submit" value="提交"/><br>
</form>
<script src="input.js"></script>
<script src="submit.js"></script>
</body>
</html>`);
