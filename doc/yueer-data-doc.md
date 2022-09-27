
## 使用示例

比如有这么一段 HTML 代码
```
<!-- 姓名输入框 -->
<input data-name="user.name" type="text" data-type='input' />
<!-- 密码输入框 -->
<input data-name="user.password" type="password" data-type='password' />
```
*标签中的 data-name 属性相当于变量名，是获取/修改元素的值的标识符。*


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

//
// 获取/修改单个元素的值
//

// 修改变量名是 "user.name" 的元素的值
yerData.set('user.name', '张三');

// 获取变量名是 "user.name" 的元素的值
var data = yerData.get('user.name'); 
==> "张三"

//
// 获取/修改多个元素的值
//

// 修改变量名是 "user.name"、"user.password" 的元素的值
yerData.set(['user.name', 'user.password'], {
  'user.name': '张三',
  'user.password': '123456'
});

// 获取变量名是 "user.name"、"user.password" 的元素的值
var data = yerData.get(['user.name', 'user.password']);
==> {"user.userName":"张三","user.password":"123456"}

//
// 获取/修改指定前缀的值
//

// 修改变量名是 "user." 开头的元素的值
yerData.set('user.*', {
  'user.name': '张三',
  'user.password': '123456'
});

// 获取变量名是 "user." 开头的元素的值
var data = yerData.get('user.*');
==> {"user.userName":"张三","user.password":"123456"}

//
// 获取/修改所有元素的值
//

// 修改所有元素的值
yerData.set('*', {
  'user.name': '张三',
  'user.password': '123456'
});

// 获取所有元素的值
var data = yerData.get('*');
==> {"user.userName":"张三","user.password":"123456"}
```
