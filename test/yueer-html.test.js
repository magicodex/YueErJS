
//
// 注册组件
//

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

//
// 测试用例
//

QUnit.test('yueer-html.test', function(assert) {
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

  var actual = yerHtml.render();
  var expected = `<!doctype html>
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
</html>`

  assert.strictEqual(actual, expected);
});
