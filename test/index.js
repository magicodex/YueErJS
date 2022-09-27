"use strict";

var assert = require('assert');
var yer = require('../index');

{
  assert.ok(yer.htmlConfig != null);
  assert.ok(yer.html != null);
  assert.ok(yer.registerComponent != null);
}

{
  assert.ok(yer.dataConfig != null);
  assert.ok(yer.data != null);
  assert.ok(yer.registerHandler != null);
}
