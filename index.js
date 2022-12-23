"use strict";

var yerHtml = require('./lib/yueer-html');
var yerData = require('./lib/yueer-data');

module.exports = {
  Html: yerHtml.Html,
  Data: yerData.Data,
  html: yerHtml.html,
  data: yerData.data,
  registerComponent: yerHtml.registerComponent,
  registerHandler: yerData.registerHandler
};
