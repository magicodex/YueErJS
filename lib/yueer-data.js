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
    handlers: {},
    nameAttributeName: 'data-name',
    typeAttributeName: 'data-type',
    defaultHandler: {}
  };

  /**
   * 获取指定表达式对应元素的数据
   * 
   * @param {*} expression 
   * @param {*} skipNull 
   * @returns 
   */
  YueErData.get = function(expression, skipNull) {
    if ((typeof expression !== 'string') && !(expression instanceof Array)) {
      throw new Error('argument#1 "expression" required string or Array');
    }

    skipNull = (skipNull || false);
    var selector = this.convertExpressionToSelector(expression);
    var elements = this.queryElementBySelector(selector);

    if ((expression instanceof Array)
      || (expression === '*')
      || (expression.charAt(expression.length - 1) === '*')) {
      var elementValues = {};

      for (var index = 0; index < elements.length; index++) {
        var element = elements[index];
        var dataName = element.getAttribute(this.nameAttributeName);
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

      return this.doGetElementValue(elements[0], skipNull);
    }
  };

  /**
   * 设置指定表达式对应元素的数据
   * 
   * @param {*} expression 
   * @param {*} value 
   * @param {*} defaultNull 
   */
  YueErData.set = function(expression, value, defaultNull) {
    if ((typeof expression !== 'string') && !(expression instanceof Array)) {
      throw new Error('argument#1 "expression" required string or Array');
    }

    defaultNull = (defaultNull || false);
    var selector = this.convertExpressionToSelector(expression);
    var elements = this.queryElementBySelector(selector);

    if (elements.length <= 0) {
      return;
    }

    if ((expression instanceof Array)
      || (expression === '*')
      || (expression.charAt(expression.length - 1) === '*')) {
      value = (value || {});

      for (var index = 0; index < elements.length; index++) {
        var element = elements[index];
        var dataName = element.getAttribute(this.nameAttributeName);
        var elementValue = value[dataName];

        if (!YueErUtil.isNullOrUndefined(elementValue) || defaultNull) {
          this.doSetElementValue(element, elementValue, defaultNull);
        }
      }
    } else {
      this.doSetElementValue(elements[0], value, defaultNull);
    }
  };

  /**
   * 获取元素的值
   * 
   * @param {*} element 
   * @param {*} skipNull 
   * @returns 
   */
  YueErData.doGetElementValue = function(element, skipNull) {
    if (YueErUtil.isNullOrUndefined(element)) {
      throw new Error('argument#1 "element is null/undefined');
    }

    var handler = this.getDataHandlerByElement(element);
    return handler.getValue(element, (skipNull || false));
  };

  /**
   * 设置元素的值
   * 
   * @param {*} element 
   * @param {*} value 
   * @param {*} defaultNull 
   */
  YueErData.doSetElementValue = function(element, value, defaultNull) {
    if (YueErUtil.isNullOrUndefined(element)) {
      throw new Error('argument#1 "element is null/undefined');
    }

    var handler = this.getDataHandlerByElement(element);
    handler.setValue(element, value, (defaultNull || false));
  };

  /**
   * 获取数据处理器
   * 
   * @param {*} element 
   * @returns 
   */
  YueErData.getDataHandlerByElement = function(element) {
    if (YueErUtil.isNullOrUndefined(element)) {
      throw new Error('argument#1 "element is null/undefined');
    }

    var handler;
    var handlerName = element.getAttribute(this.typeAttributeName);

    if (!YueErUtil.isNullOrUndefined(handlerName)) {
      handler = this.handlers[handlerName];

      if (YueErUtil.isNullOrUndefined(handler)) {
        throw new Error('not found handler "' + handlerName + '"');
      }

      return handler;
    }

    var tagName = element.tagName.toLowerCase();
    handlerName = '@' + tagName;
    handler = this.handlers[handlerName];

    if (YueErUtil.isNullOrUndefined(handler)) {
      handler = this.defaultHandler;
    }

    return handler;
  }

  /**
   * 查找指定选择器对应的元素
   * 
   * @param {*} selector 
   * @returns 
   */
  YueErData.queryElementBySelector = function(selector) {
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
   * 转换表达式成选择器
   * 
   * @param {*} expression 
   * @returns 
   */
  YueErData.convertExpressionToSelector = function(expression) {
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
          selectorStr = '[' + YueErData.nameAttributeName + ']';
        } else if (expressionStr.charAt(expressionStr.length - 1) === '*') {
          var prefixStr = expressionStr.slice(0, -1);
          selectorStr = '[' + YueErData.nameAttributeName + '^="' + prefixStr + '"]';
        } else {
          selectorStr = '[' + YueErData.nameAttributeName + '="' + expressionStr + '"]';
        }

        selectorArray.push(selectorStr);
      }
    }

    return selectorArray;
  };

  /**
   * 添加指定的前缀
   * 
   * @param {*} obj 
   * @param {*} prefix 
   * @returns 
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
   * 移除指定的前缀
   * 
   * @param {*} obj 
   * @param {*} prefix 
   * @returns 
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
   * 默认获取元素值的方法
   * 
   * @param {*} element 
   * @param {*} skipNull 
   */
  YueErData.defaultHandler.getValue = function(element, skipNull) {
    var tagName = element.tagName.toLowerCase();
    var value;

    if (tagName in ['input', 'textarea']) {
      var inputType = element.getAttribute('type');

      if (tagName === 'input' && (inputType in ['radio', 'checkbox'])) {
        throw new Error('defaultHandler not support the tag "input[type=' + inputType + ']"');
      }

      value = element.value;
    } else if (tagName in ['select']) {
      throw new Error('defaultHandler not support the tag "' + tagName + '"');
    } else {
      value = element.innerHtml;
    }

    return value;
  };

  /**
   * 默认设置元素值的方法
   * 
   * @param {*} element 
   * @param {*} value 
   * @param {*} defaultNull 
   */
  YueErData.defaultHandler.setValue = function(element, value, defaultNull) {
    var tagName = element.tagName.toLowerCase();

    if (YueErUtil.isNullOrUndefined(value)) {
      value = '';
    }

    if (tagName in ['input', 'textarea']) {
      if (tagName === 'input' && (inputType in ['radio', 'checkbox'])) {
        throw new Error('defaultHandler not support the tag "input[type=' + inputType + ']"');
      }

      element.value = value;
    } else if (tagName in ['select']) {
      throw new Error('defaultHandler not support the tag "' + tagName + '"');
    } else {
      element.innerHtml = value;
    }
  };

  /**
   * 创建数据对象
   * 
   * @param {*} baseElement 
   * @returns 
   */
  function createData(baseElement) {
    if (YueErUtil.isNullOrUndefined(baseElement)) {
      throw new Error('argument#1 "baseElement" is null/undefined');
    }

    var newData = Object.create(YueErData);
    newData.baseElement = baseElement;

    return newData;
  }

  /**
   * 注册数据处理器
   * 
   * @param {*} name 
   * @param {*} handler 
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

  _yer.dataConfig = YueErData;
  _yer.data = createData;
  _yer.registerHandler = registerHandler;
})((typeof window !== 'undefined' ? window : this), 'yer');
