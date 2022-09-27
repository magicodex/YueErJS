# YueErJS
支持组件化封装 HTML 代码片段，以便快速生成页面以及更改/读取表单的数据。

![明月几时有？](https://s3.bmp.ovh/imgs/2022/09/27/1d1efabc869f8556.png "明月几时有？")

## 安装依赖
```
npm install --save-dev yueerjs
```

## 使用示例

**yeer-html.js**
```
// 创建html对象
var yerHtml = yer.html({ title: 'YueErJS' });

// 添加 body 内容
yerHtml.appendBody('<h1>Hello, YueErJS!</h1>');

// 渲染页面
var html = yerHtml.render();
```
*查看更多文档请点击* [yueer-html-doc.md](https://github.com/magicodex/YueErJS/blob/main/doc/yueer-html-doc.md)

**yueer-data.js**
```
var yerData = yer.data(document);
yerData.set(['userName', 'password'], {
  'userName': '张三',
  'password': '123456'
});

var data = yerData.get(['userName', 'password']);
==> {"userName":"张三","password":"123456"}
```
*查看更多文档请点击* [yueer-data-doc.md](https://github.com/magicodex/YueErJS/blob/main/doc/yueer-data-doc.md)

## 开源协议
MIT
