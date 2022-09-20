'use strict'

function addScript(url) {
  if (!(url in this.scriptIndexes)) {
    this.scripts.append(url);
  }
}

function addStype(url) {
  if (!(url in this.styleIndexes)) {
    this.styles.append(url);
  }
}

function appendHtml(html) {
  this.body = this.body + html;
}

function renderHtml() {
  var html = `<!doctype html>
  <html lang="zh-CN">
  <head>`;

  for (var style in this.styles) {
    html += '<link rel="stylesheet" href="' + style + '">\n';
  }

  html += `</head>
  <body>`;

  html += this.body;

  for (var script in this.scripts) {
    html += '<script src="' + script + '"></script>\n';
  }

  html += `</body>
  </html>`;

  return html;
}

function createHtml() {
  var html = {
    scriptIndexes: {},
    styleIndexes: {},
    scripts: [],
    styles: [],
    head: {},
    body: '',
    render: renderHtml,
    append: appendHtml
  };

  for (var name in this.components) {
    html[name] = this.components[name];
  }

  return html;
}

function registerComponent(name, component) {
  this.components[name] = component;
}

module.exports = {
  components: {},
  html: createHtml,
  register: registerComponent
};
