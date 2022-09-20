'use strict'

var YueErHtml = {
  indexes: {},
  components: {},
  scripts: [],
  styles: [],
  head: [],
  body: []
}

YueErHtml.script = function(url) {
  var key = 'script:' + url;

  if (!(key in this.indexes)) {
    var value = '<script src="' + url + '"></script>';

    this.indexes[key] = value;
    this.scripts.push(value + '\n');
  }
}

YueErHtml.style = function(url) {
  var key = 'style:' + url;

  if (!(key in this.indexes)) {
    var value = '<link rel="stylesheet" href="' + url + '">'

    this.indexes[key] = value;
    this.styles.push(value + '\n');
  }
}

YueErHtml.append = function(html) {
  this.body.push(html);
}

YueErHtml.render = function() {
  var html = [];
  html.push(`<!doctype html>
  <html lang="zh-CN">
  <head>\n`);

  for (var tag in this.head) {
    html.push(tag + '\n');
  }

  for (var style in this.styles) {
    html.push(this.styles[style] + '\n');
  }

  html.push(`</head>
  <body>\n`);

  html = html.concat(this.body);

  for (var script in this.scripts) {
    html.push(this.scripts[script] + '\n');
  }

  html.push(`</body>
  </html>`);

  return html.join('');
}

YueErHtml.install = function(component) {
  for (var style in component.styles) {
    this.style(component.styles[style]);
  }

  for (var script in component.scripts) {
    this.script(component.scripts[script]);
  }

  for (var dependency in component.dependencies) {
    this.install(YueErHtml.components[component.dependencies[dependency]]);
  }
};

module.exports = {
  html: () => {
    return Object.create(YueErHtml);
  },
  components: YueErHtml.components,
  component: (name, component, opts) => {

    var proxy = function() {
      this.install(component);

      return component.apply(this, arguments);
    };

    YueErHtml[name] = proxy;
    YueErHtml.components[name] = component;

    if (opts != undefined) {
      component.dependencies = opts.dependencies;
      component.styles = opts.styles;
      component.scripts = opts.scripts;
    }

    component.dependencies =  component.dependencies || [];
    component.styles =  component.styles || [];
    component.scripts =  component.scripts || [];

    return component;
  }
};
