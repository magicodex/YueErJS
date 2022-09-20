'use strict'

var yer = require("../index");

var html = yer.html();
html.$form({}, () => {
  html.$input({
    label: '代码',
    name: 'code'
  });

  html.$input({
    label: '名称',
    name: 'name'
  });

  html.$button({
    text: '提交'
  });
});

var htmlContent = html.render();

console.info(htmlContent);
