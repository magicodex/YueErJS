"use strict";

var yerHtml = require('./lib/yueer-html');
var yerData = require('./lib/yueer-data');

module.exports = {
  htmlConfig: yerHtml.htmlConfig,
  dataConfig: yerData.dataConfig,
  html: yerHtml.html,
  data: yerData.data,
  registerComponent: yerHtml.registerComponent,
  registerHandler: yerData.registerHandler
};
