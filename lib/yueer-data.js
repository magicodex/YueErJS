"use strict";

(function(global, namespace) {
  var _yer;

  if (typeof module === 'object') {
    module.exports = (module.exports || {});
    _yer = module.exports;
  } else {
    global[namespace] = (global[namespace] || {});
    _yer = global[namespace];
  }

  var YueErUtil = {
    isNullOrUndefined: function(obj) {
      return (obj === null || obj === undefined);
    }
  };

  var YueErData = {
    baseElement: null,
    // 数据处理器
    handlers: {},
    // 记录数据名称的属性
    nameAttributeName: 'data-name',
    // 记录数据类型的属性
    typeAttributeName: 'data-type',
    // 默认数据处理器
    defaultHandler: { handlerName: 'default' }
  };

  /**
   * @function YueErData.get
   * @description 获取指定表达式对应元素的数据
   * @param {(string|string[])} expression 表达式
   * @param {boolean} [skipNull] 是否跳过null值
   * @returns {*} 值
   */
  YueErData.get = function(expression, skipNull) {
    // 表达式只能是字符串或数组
    if ((typeof expression !== 'string') && !(expression instanceof Array)) {
      throw new Error('argument#1 "expression" required string or Array');
    }

    skipNull = (skipNull || false);
    // 转换表达式成选择器
    var selector = this.convertExpressionToSelector(expression);
    // 查找指定选择器对应的元素
    var elements = this.queryElementBySelector(selector);

    // 若表达式是数组或者"*"结尾的字符串，则是获取多个元素的值
    if ((expression instanceof Array)
      || (expression.charAt(expression.length - 1) === '*')) {
      var elementValues = {};

      for (var index = 0; index < elements.length; index++) {
        var element = elements[index];
        var dataName = element.getAttribute(this.nameAttributeName);
        // 获取元素的值
        var elementValue = this.doGetElementValue(element, skipNull);

        if (!YueErUtil.isNullOrUndefined(elementValue) || !skipNull) {
          elementValues[dataName] = elementValue;
        }
      }

      return elementValues;
    } else {
      if (elements.length <= 0) {
        return null;
      }

      // 获取元素的值
      return this.doGetElementValue(elements[0], skipNull);
    }
  };

  /**
   * @function YueErData.set
   * @description 设置指定表达式对应元素的数据
   * @param {string|string[]} expression 表达式
   * @param {*} value 值
   * @param {boolean} [defaultNull] 是否跳过null值
   */
  YueErData.set = function(expression, value, defaultNull) {
    // 表达式只能是字符串或数组
    if ((typeof expression !== 'string') && !(expression instanceof Array)) {
      throw new Error('argument#1 "expression" required string or Array');
    }

    defaultNull = (defaultNull || false);
    // 转换表达式成选择器
    var selector = this.convertExpressionToSelector(expression);
    // 查找指定选择器对应的元素
    var elements = this.queryElementBySelector(selector);

    if (elements.length <= 0) {
      return;
    }

    // 若表达式是数组或者"*"结尾的字符串，则是设置多个元素的值
    if ((expression instanceof Array)
      || (expression.charAt(expression.length - 1) === '*')) {
      value = (value || {});

      for (var index = 0; index < elements.length; index++) {
        var element = elements[index];
        var dataName = element.getAttribute(this.nameAttributeName);
        var elementValue = value[dataName];

        if (!YueErUtil.isNullOrUndefined(elementValue) || defaultNull) {
          // 设置元素的值
          this.doSetElementValue(element, elementValue, defaultNull);
        }
      }
    } else {
      // 设置元素的值
      this.doSetElementValue(elements[0], value, defaultNull);
    }
  };

  /**
   * @function YueErData.doGetElementValue
   * @description 获取元素的值
   * @param {(Document|Element)} element DOM元素
   * @param {boolean} [skipNull] 是否跳过null值
   * @returns {*} 值
   */
  YueErData.doGetElementValue = function(element, skipNull) {
    if (YueErUtil.isNullOrUndefined(element)) {
      throw new Error('argument#1 "element is null/undefined');
    }

    // 获取数据处理器
    var handler = this.getDataHandlerByElement(element);
    // 获取元素的值
    return handler.getValue(element, (skipNull || false));
  };

  /**
   * @function YueErData.doSetElementValue
   * @description 设置元素的值
   * @param {(Document|Element)} element DOM元素
   * @param {*} value 值
   * @param {boolean} [defaultNull] 是否默认null值
   */
  YueErData.doSetElementValue = function(element, value, defaultNull) {
    if (YueErUtil.isNullOrUndefined(element)) {
      throw new Error('argument#1 "element is null/undefined');
    }

    // 获取数据处理器
    var handler = this.getDataHandlerByElement(element);
    // 设置元素的值
    handler.setValue(element, value, (defaultNull || false));
  };

  /**
   * @function YueErData.getDataHandlerByElement
   * @description 获取数据处理器
   * @param {(Document|Element)} element DOM元素 
   * @returns {Object} 数据处理器
   */
  YueErData.getDataHandlerByElement = function(element) {
    if (YueErUtil.isNullOrUndefined(element)) {
      throw new Error('argument#1 "element is null/undefined');
    }

    var handler;
    var handlerName = element.getAttribute(this.typeAttributeName);

    // 先获取自定义的数据处理器
    if (!YueErUtil.isNullOrUndefined(handlerName)) {
      handler = this.handlers[handlerName];

      if (YueErUtil.isNullOrUndefined(handler)) {
        throw new Error('not found handler "' + handlerName + '"');
      }

      return handler;
    }

    // 如果没有自定义的处理器，则获取标签对应的处理器
    var tagName = element.tagName.toLowerCase();
    handlerName = '@' + tagName;
    handler = this.handlers[handlerName];

    // 如果没有找到自定义的处理器和标签对应的处理器，则取默认处理器
    if (YueErUtil.isNullOrUndefined(handler)) {
      handler = this.defaultHandler;
    }

    return handler;
  }

  /**
   * @function YueErData.queryElementBySelector
   * @description 查找指定选择器对应的元素
   * @param {(string|string[])} selector 选择器
   * @returns {(Document|Element)} DOM元素
   */
  YueErData.queryElementBySelector = function(selector) {
    // 表达式只能是字符串或数组
    if ((typeof selector !== 'string') && !(selector instanceof Array)) {
      throw new Error('argument#1 "selector" required string or Array');
    }

    var selectorStr;

    if (selector instanceof Array) {
      selectorStr = selector.join(',');
    } else {
      selectorStr = selector;
    }

    return this.baseElement.querySelectorAll(selectorStr);
  };

  /**
   * @function YueErData.convertExpressionToSelector
   * @description 转换表达式成选择器
   * @param {(string|string[])} expression 表达式
   * @returns {string[]} 选择器数组
   */
  YueErData.convertExpressionToSelector = function(expression) {
    // 表达式只能是字符串或数组
    if ((typeof expression !== 'string') && !(expression instanceof Array)) {
      throw new Error('argument#1 "expression" required string or Array');
    }

    var selectorArray = [];
    var expressionArray;

    if (expression instanceof Array) {
      expressionArray = expression;
    } else {
      expressionArray = [expression];
    }

    for (var index = 0; index < expressionArray.length; index++) {
      var expressionStr = expressionArray[index];

      if (expressionStr !== '') {
        var selectorStr;

        if (expressionStr === '*') {
          // 表达式是"*"的情况，则匹配所有的元素
          selectorStr = '[' + YueErData.nameAttributeName + ']';
        } else if (expressionStr.charAt(expressionStr.length - 1) === '*') {
          // 表达式是"*"结尾的情况，则匹配指定前缀数据名称的元素
          var prefixStr = expressionStr.slice(0, -1);
          selectorStr = '[' + YueErData.nameAttributeName + '^="' + prefixStr + '"]';
        } else {
          // 匹配指定数据名称的元素
          selectorStr = '[' + YueErData.nameAttributeName + '="' + expressionStr + '"]';
        }

        selectorArray.push(selectorStr);
      }
    }

    return selectorArray;
  };

  /**
   * @function YueErData.prefix
   * @description 添加指定的前缀
   * @param {*} obj 对象
   * @param {string} prefix 前缀
   * @returns {*} 结果
   */
  YueErData.prefix = function(obj, prefix) {
    if (typeof prefix !== 'string') {
      throw new Error('argument#2 "prefix" required string');
    }

    if (obj === null || (typeof obj !== 'object')) {
      return obj;
    }

    var newObj = {};
    var newKey;

    for (var key in obj) {
      newKey = prefix + key;
      newObj[newKey] = obj[key];
    }

    return newObj;
  };

  /**
   * @function YueErData.unprefix
   * @description 移除指定的前缀
   * @param {*} obj 对象
   * @param {string} prefix 前缀
   * @returns {*} 结果
   */
  YueErData.unprefix = function(obj, prefix) {
    if (typeof prefix !== 'string') {
      throw new Error('argument#2 "prefix" required string');
    }

    if (obj === null || (typeof obj !== 'object')) {
      return obj;
    }

    var newObj = {};
    var newKey;

    for (var key in obj) {
      if (key.indexOf(prefix) === 0) {
        newKey = key.substring(prefix.length);
      } else {
        newKey = key;
      }

      newObj[newKey] = obj[key];
    }

    return newObj;
  };

  /**
   * @function YueErData.defaultHandler.getValue
   * @description 默认获取元素值的方法
   * @param {(Document|Element)} element DOM元素
   * @param {boolean} [skipNull] 是否跳过null值
   */
  YueErData.defaultHandler.getValue = function(element, skipNull) {
    var tagName = element.tagName.toLowerCase();
    var value;

    if (['input', 'textarea'].includes(tagName)) {
      var inputType = element.getAttribute('type');

      if (tagName === 'input' && (['radio', 'checkbox'].includes(inputType))) {
        throw new Error('defaultHandler not support the tag "input[type=' + inputType + ']"');
      }

      value = element.value;
    } else if (['select'].includes(tagName)) {
      throw new Error('defaultHandler not support the tag "' + tagName + '"');
    } else {
      value = element.innerHtml;
    }

    return value;
  };

  /**
   * @function YueErData.defaultHandler.setValue
   * @description 默认设置元素值的方法
   * @param {(Document|Element)} element DOM元素
   * @param {*} value 值
   * @param {boolean} [defaultNull] 是否默认null值
   */
  YueErData.defaultHandler.setValue = function(element, value, defaultNull) {
    var tagName = element.tagName.toLowerCase();

    if (YueErUtil.isNullOrUndefined(value)) {
      value = '';
    }

    if (['input', 'textarea'].includes(tagName)) {
      if (tagName === 'input' && (['radio', 'checkbox'].includes(inputType))) {
        throw new Error('defaultHandler not support the tag "input[type=' + inputType + ']"');
      }

      element.value = value;
    } else if (['select'].includes(tagName)) {
      throw new Error('defaultHandler not support the tag "' + tagName + '"');
    } else {
      element.innerHtml = value;
    }
  };

  /**
   * @function YueErData.createData
   * @description 创建数据对象
   * @param {(Document|Element)} baseElement DOM元素
   * @returns {Object} 新的数据对象
   */
  function createData(baseElement) {
    if (YueErUtil.isNullOrUndefined(baseElement)) {
      throw new Error('argument#1 "baseElement" is null/undefined');
    }

    // 创建对象
    var newData = Object.create(YueErData);
    newData.baseElement = baseElement;

    return newData;
  }

  /**
   * @function YueErData.registerHandler
   * @description 注册数据处理器
   * @param {string} name 数据处理器名称
   * @param {Object} handler 数据处理器
   */
  function registerHandler(name, handler) {
    if (YueErUtil.isNullOrUndefined(name)) {
      throw new Error('argument#1 "name" is null/undefined');
    }

    if (YueErUtil.isNullOrUndefined(handler)) {
      throw new Error('argument#2 "handler" is null/undefined');
    }

    YueErData.handlers[name] = handler;
  }

  _yer.Data = YueErData;
  _yer.data = createData;
  _yer.registerHandler = registerHandler;
  _yer.data.util = YueErUtil;
})((typeof window !== 'undefined' ? window : this), 'yer');
