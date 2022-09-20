'use strict'

var components = {};

components.$form = function(opts, callback) {
  this.body += '<form>\n';
  callback();
  this.body += '</form>\n';
};

components.$input =  function(opts) {
  this.body += (opts.label + ': <input type="text" name="' + opts.name + '"/><br>\n');
};

components.$button = function(opts) {
  this.body += '<button>' + opts.text + '</button><br>\n';
};

module.exports = components;