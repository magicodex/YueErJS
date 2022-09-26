
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

QUnit.test('[yueer-data] get/set', function(assert) {
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
