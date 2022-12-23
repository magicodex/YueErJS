"use strict";

(function(global, namespace) {
  var _yer;

  if (typeof module === 'object') {
    module.exports = (module.exports || {});
    _yer = module.exports;
  } else {
    global[namespace] = (global[namespace] || {});
    _yer = global[namespace];
  }

  var YueErUtil = {
    isNullOrUndefined: function(obj) {
      return (obj === null || obj === undefined);
    }
  };

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
  };

  /**
   * 添加样式链接
   * 
   * @param {*} url 
   */
  YueErHtml.style = function(url) {
    if (YueErUtil.isNullOrUndefined(url)) {
      throw new Error('argument#1 "url" is null/undefined');
    }

    var key = 'style:' + url;

    if (!(key in this.indexes)) {
      var tag = '<link rel="stylesheet" href="' + url + '">';

      this.indexes[key] = tag;
      this.styles.push(tag);
    }
  };

  /**
   * 添加脚本链接
   * 
   * @param {*} url 
   */
  YueErHtml.script = function(url) {
    if (YueErUtil.isNullOrUndefined(url)) {
      throw new Error('argument#1 "url" is null/undefined');
    }

    var key = 'script:' + url;

    if (!(key in this.indexes)) {
      var tag = '<script src="' + url + '"></script>';

      this.indexes[key] = tag;
      this.scripts.push(tag);
    }
  };

  /**
 * 添加 head 内容
 * 
 * @param {*} html 
 */
  YueErHtml.appendHead = function(html) {
    if (YueErUtil.isNullOrUndefined(html)) {
      throw new Error('argument#1 "html" is null/undefined');
    }

    this.head.push(html);
  };

  /**
   * 添加 body 内容
   * 
   * @param {*} html 
   */
  YueErHtml.appendBody = function(html) {
    if (YueErUtil.isNullOrUndefined(html)) {
      throw new Error('argument#1 "html" is null/undefined');
    }

    this.body.push(html);
  };

  /**
   * 安装组件
   * 
   * @param {*} component 
   */
  YueErHtml.install = function(component) {
    if (YueErUtil.isNullOrUndefined(component)) {
      throw new Error('argument#1 "component" is null/undefined');
    }

    var dependencies = component.dependencies;
    // 安装组件
    for (var index = 0; index < dependencies.length; index++) {
      var dependencyComponentName = dependencies[index];
      var dependencyComponent = YueErHtml.components[dependencyComponentName];

      if (YueErUtil.isNullOrUndefined(dependencyComponent)) {
        throw new Error('not found component "' + dependencyComponentName + '"');
      }

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
  };

  /**
   * 创建html对象
   * 
   * @param {*} opts 
   * @returns 
   */
  function createHtml(opts) {
    var yerHtml = Object.create(YueErHtml);
    yerHtml.indexes = {};
    yerHtml.styles = [];
    yerHtml.scripts = [];
    yerHtml.head = [];
    yerHtml.body = [];

    opts = (opts || []);
    var charset = (opts.charset || "utf-8");
    // 规定字符编码
    yerHtml.appendHead('<meta charset="' + charset + '">');
    // 支持响应式布局
    yerHtml.appendHead('<meta name="viewport" content="width=device-width, initial-scale=1">');

    // 设置标题
    var title = opts.title;
    if (!YueErUtil.isNullOrUndefined(title)) {
      yerHtml.appendHead('<title>' + title + '</title>');
    }

    return yerHtml;
  }

  /**
   * 注册组件
   * 
   * @param {*} name 
   * @param {*} component 
   * @param {*} opts 
   */
  function registerComponent(name, component, opts) {
    if (YueErUtil.isNullOrUndefined(name)) {
      throw new Error('argument#1 "name" is null/undefined');
    }

    if (YueErUtil.isNullOrUndefined(component)) {
      throw new Error('argument#2 "component" is null/undefined');
    }

    opts = (opts || {});
    // 设置组件依赖
    component.dependencies = (opts.dependencies || []);
    // 设置组件样式
    component.styles = (opts.styles || []);
    // 设置组件脚本
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

  _yer.htmlConfig = YueErHtml;
  _yer.html = createHtml;
  _yer.registerComponent = registerComponent;
})((typeof window !== 'undefined' ? window : this), 'yer');