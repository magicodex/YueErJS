
## 使用示例

### 注册数据处理器
```
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
```

### 获取/设置数据
```
var yerData = yer.data(document);
yerData.set('login.*', {
  'login.userName': '张三',
  'login.password': '123456'
});

var data = yerData.get('login.*');
==> {"login.userName":"张三","login.password":"123456"}
```
