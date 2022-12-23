
//
// 注册数据处理器
//

yer.registerHandler('input', {
  getValue: function(element, skipNull) {
    return $(element).val();
  },
  setValue(element, value, defaultNull) {
    $(element).val(value);
  }
});

yer.registerHandler('password', {
  getValue: function(element, skipNull) {
    return $(element).val();
  },
  setValue(element, value, defaultNull) {
    $(element).val(value);
  }
});

//
// 测试用例
//

QUnit.test('yueer-data.test', function(assert) {
  var jqBaseElement = $('#qunit-fixture');
  jqBaseElement.append('<input data-name="login.userName" data-type="input"/>');
  jqBaseElement.append('<input data-name="login.password" data-type="password"/>');

  var yerData = yer.data(jqBaseElement.get(0));
  yerData.set('login.*', {
    'login.userName': '张三',
    'login.password': '123456'
  });

  var actual = yerData.get('login.*');
  assert.deepEqual(actual, {
    'login.userName': '张三',
    'login.password': '123456'
  });
});

//
//
//
QUnit.test('yueer-data.data.util.isNullOrUndefined', function(assert) {
  //
  assert.strictEqual(yer.data.util.isNullOrUndefined("1"), false);
  assert.strictEqual(yer.data.util.isNullOrUndefined(1), false);

  //
  assert.strictEqual(yer.data.util.isNullOrUndefined(null), true);
  assert.strictEqual(yer.data.util.isNullOrUndefined(undefined), true);
});

//
//
//
QUnit.test('yueer-data.data.getDataHandlerByElement', function(assert) {
  var jqBaseElement = $('#qunit-fixture');
  jqBaseElement.append('<p id="id1"></p>');
  jqBaseElement.append('<span id="id2"></span>');
  jqBaseElement.append('<table id="id3" data-type="grid"></span>');

  var yerData = yer.data(jqBaseElement.get(0));
  var element1 = $('#qunit-fixture').children('#id1')[0];
  var element2 = $('#qunit-fixture').children('#id2')[0];
  var element3 = $('#qunit-fixture').children('#id3')[0];

  try {
    yer.registerHandler('@span', { handlerName: 'handler1' });
    yer.registerHandler('grid', { handlerName: 'handler2' })

    // 默认处理器
    {
      var handler = yerData.getDataHandlerByElement(element1);
      assert.strictEqual(handler.handlerName, 'default');
    }

    // 匹配到标签对应的处理器
    {
      var handler = yerData.getDataHandlerByElement(element2);
      assert.strictEqual(handler.handlerName, 'handler1');
    }

    // 找到自定义的数据处理器
    {
      var handler = yerData.getDataHandlerByElement(element3);
      assert.strictEqual(handler.handlerName, 'handler2');
    }
  } finally {
    yer.Data.handlers = {};
  }
});

//
//
//
QUnit.test('yueer-data.data.queryElementBySelector', function(assert) {
  var jqBaseElement = $('#qunit-fixture');
  jqBaseElement.append('<input data-name="login.userName" data-type="input"/>');
  jqBaseElement.append('<input data-name="login.password" data-type="password"/>');

  var yerData = yer.data(jqBaseElement.get(0));
  var elements = yerData.queryElementBySelector(['[data-name^="login."]'])

  assert.strictEqual(elements.length, 2);
});

//
//
//
QUnit.test('yueer-data.Data.convertExpressionToSelector', function(assert) {
  // 数组
  {
    var actual = yer.Data.convertExpressionToSelector(['field1', 'field2']);

    assert.deepEqual(actual, ['[data-name="field1"]', '[data-name="field2"]']);
  }

  // "*"结尾
  {
    var actual = yer.Data.convertExpressionToSelector("field*");

    assert.deepEqual(actual, ['[data-name^="field"]']);
  }

  // "*"字符串
  {
    var actual = yer.Data.convertExpressionToSelector("*");

    assert.deepEqual(actual, ['[data-name]']);
  }
});

//
//
//
QUnit.test('yueer-data.Data.prefix', function(assert) {
  {
    var actual = yer.Data.prefix({
      field1: 'field1Value',
      field2: 'field2Value'
    }, 'user.');

    assert.strictEqual(actual['user.field1'], 'field1Value');
    assert.strictEqual(actual['user.field2'], 'field2Value');
  }

  // null
  {
    var actual = yer.Data.prefix(null, 'user.');

    assert.strictEqual(actual, null);
  }

  // 字符串
  {
    var actual = yer.Data.prefix('1', 'user.');

    assert.strictEqual(actual, '1');
  }
});

//
//
//
QUnit.test('yueer-data.Data.unprefix', function(assert) {
  {
    var actual = yer.Data.unprefix({
      'user.field1': 'field1Value',
      'user.field2': 'field2Value',
      'remark': 'remark1'
    }, 'user.');

    assert.strictEqual(actual['field1'], 'field1Value');
    assert.strictEqual(actual['field2'], 'field2Value');
    assert.strictEqual(actual['remark'], 'remark1');
  }

  // null
  {
    var actual = yer.Data.unprefix(null, 'user.');

    assert.strictEqual(actual, null);
  }

  // 字符串
  {
    var actual = yer.Data.unprefix('1', 'user.');

    assert.strictEqual(actual, '1');
  }
});
