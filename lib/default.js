'use strict'

var yer = require("./core");

yer.component('$form', function(opts, callback) {
  this.append('<form>\n');
  callback();
  this.append('</form>\n');
});

yer.component('$input', function(opts) {
  this.append(opts.label + ': <input type="text" name="' + opts.name + '"/><br>\n');
}, {
  styles: ['input.css']
});

yer.component('$button', function(opts) {
  this.append('<button>' + opts.text + '</button><br>\n');
}, {
  dependencies: ['$input'],
  styles: ['button.css'],
  scripts: ['button.js']
});

module.exports = {
  $form: yer.components.$form,
  $input: yer.components.$input,
  $button: yer.components.$button
};