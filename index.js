'use strict'

var html = require('./lib/html');
var data = require('./lib/data')

module.exports = {
  htmlConfig: html.config,
  html: html.html,
  registerComponent: html.registerComponent,
  dataConfig: data.config,
  data: data.data,
  registerHandler: data.registerHandler
};
