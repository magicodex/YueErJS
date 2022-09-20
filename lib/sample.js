'use strict'
var yer = require("./core");

//
// form类型
//
yer.component('$form', function(opts, callback) {
  this.append('<form action="' + opts.url + '" method="post">\n');
  callback();
  this.append('</form>\n');
});

//
// input类型
//
yer.component('$input', function(opts) {
  this.append('<input type="text" name="' + opts.name +
    '" placeholder="' + opts.placeholder + '"/><br>\n');
}, {
  styles: ['input.css'],
  scripts: ['input.js']
});

//
// submit类型
//
yer.component('$submit', function(opts) {
  this.append('<input type="submit" value="' + opts.label + '"/><br>\n');
}, {
  dependencies: ['$input'],
  styles: ['submit.css'],
  scripts: ['submit.js']
});

module.exports = {
  $form: yer.components.$form,
  $input: yer.components.$input,
  $submit: yer.components.$submit
};

//
// 示例代码
//

var html = yer.html();

html.$form({}, () => {
  html.$input({
    name: 'code',
    placeholder: '请输入代码...'
  });

  html.$input({
    name: 'name',
    placeholder: '请输入名称...'
  });

  html.$submit({
    label: '提交'
  });
});

console.info(html.render());