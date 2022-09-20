'use strict'

var yer = require("./main");

yer.component('$form', function(opts, callback) {
  this.append('<form>\n');
  callback();
  this.append('</form>\n');
});

yer.component('$input', function(opts) {
  this.append(opts.label + ': <input type="text" name="' + opts.name + '"/><br>\n');
});

yer.component('$button', function(opts) {
  this.append('<button>' + opts.text + '</button><br>\n');
});

module.exports = {
  $form: yer.components.$form,
  $input: yer.components.$input,
  $button: yer.components.$button
};