'use strict'

var YueErHtml = {
  // 组件
  components: {},
  //
  indexes: {},
  // link标签
  styles: [],
  // script标签
  scripts: [],
  // head标签
  head: [],
  // body标签
  body: []
}

/**
 * 添加样式
 * 
 * @param {*} url 
 */
YueErHtml.style = function(url) {
  var key = 'style:' + url;

  if (!(key in this.indexes)) {
    var tag = '<link rel="stylesheet" href="' + url + '">'

    this.indexes[key] = tag;
    this.styles.push(tag);
  }
}

/**
 * 添加脚本
 * 
 * @param {*} url 
 */
YueErHtml.script = function(url) {
  var key = 'script:' + url;

  if (!(key in this.indexes)) {
    var tag = '<script src="' + url + '"></script>';

    this.indexes[key] = tag;
    this.scripts.push(tag);
  }
}

/**
 * 安装组件
 * 
 * @param {*} component 
 */
YueErHtml.install = function(component) {
  var dependencies = component.dependencies;
  // 安装组件
  for (var index = 0; index < dependencies.length; index++) {
    var dependencyComponentName = dependencies[index];
    var dependencyComponent = YueErHtml.components[dependencyComponentName];
    this.install(dependencyComponent);
  }

  var styles = component.styles;
  // 添加样式
  for (var index = 0; index < styles.length; index++) {
    var tag = styles[index];
    this.style(tag);
  }

  var scripts = component.scripts;
  // 添加脚本
  for (var index = 0; index < scripts.length; index++) {
    var tag = scripts[index];
    this.script(tag);
  }
};

/**
 * 添加内容
 * 
 * @param {*} html 
 */
YueErHtml.append = function(html) {
  this.body.push(html);
}

/**
 * 渲染页面
 * 
 * @returns 
 */
YueErHtml.render = function() {
  var html = [];
  html.push('<!doctype html>\n<html lang="zh-CN">\n<head>\n');

  // head标签
  for (var index = 0; index < this.head.length; index++) {
    var tag = this.head[index];
    html.push(tag + '\n');
  }

  // link标签
  for (var index = 0; index < this.styles.length; index++) {
    var tag = this.styles[index];
    html.push(tag + '\n');
  }

  // body标签
  html.push('</head>\n<body>\n');
  html = html.concat(this.body);

  // script标签
  for (var index = 0; index < this.scripts.length; index++) {
    var tag = this.scripts[index];
    html.push(tag + '\n');
  }

  html.push('</body>\n</html>');
  return html.join('');
}

/**
 * 创建html对象
 * 
 * @returns 
 */
function createHtml() {
  return Object.create(YueErHtml);
}

/**
 * 注册组件
 * 
 * @param {*} name 
 * @param {*} component 
 * @param {*} opts 
 */
function registerComponent(name, component, opts) {
  opts = (opts || {});
  component.dependencies = (opts.dependencies || []);
  component.styles = (opts.styles || []);
  component.scripts = (opts.scripts || []);

  var componentProxy = function() {
    // 安装组件
    this.install(component);
    // 调用组件
    return component.apply(this, arguments);
  }

  YueErHtml[name] = componentProxy;
  YueErHtml.components[name] = component;
}

module.exports = {
  components: YueErHtml.components,
  html: createHtml,
  component: registerComponent
};
