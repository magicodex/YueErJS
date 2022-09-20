'use strict'

var YueErHtml = {
  dependencies: {},
  components: {},
  scripts: [],
  styles: [],
  head: [],
  body: []
}

YueErHtml.script = function(url) {
  if (!(('script:' + url) in this.dependencies)) {
    this.scripts.push('<script src="' + url + '"></script>');

    this.dependencies['script:' + url] = 0;
  } else {
    this.dependencies['script:' + url] += 1;
  }
}

YueErHtml.style = function(url) {
  if (!(('style:' + url) in this.dependencies)) {
    this.styles.push('<link rel="stylesheet" href="' + url + '">\n');

    this.dependencies['style:' + url] = 0;
  } else {
    this.dependencies['style:' + url] += 1;
  }
}

YueErHtml.append = function(html) {
  this.body.push(html);
}

YueErHtml.render = function() {
  var html = [];
  html.push(`<!doctype html>
  <html lang="zh-CN">
  <head>`);

  for (var tag in this.head) {
    html.push(tag + '\n');
  }

  for (var style in this.styles) {
    html.push(style + '\n');
  }

  html.push(`</head>
  <body>`);

  html = html.concat(this.body);

  for (var script in this.scripts) {
    html.push(script + '\n');
  }

  html.push(`</body>
  </html>`);

  return html.join('');
}

module.exports = {
  html: () => {
    return Object.create(YueErHtml);
  },
  components: YueErHtml.components,
  component: (name, component) => {
    YueErHtml[name] = component;
    YueErHtml.components[name] = component;

    component.dependencies = [];
    component.styles = [];
    component.scripts = [];

    return component;
  }
};
