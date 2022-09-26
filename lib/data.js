"use strict";

(function(global, namespace) {

  if (typeof module === 'object' && typeof module.export === 'undefined') {
    global = {};
    module.export = global;
  }

  var YueErData = {
    handlers: {},
    baseElement: null,
    nameAttributeName: 'data-name',
    typeAttributeName: 'data-type'
  };

  /**
   * 获取数据
   * 
   * @param {string|string[]} expression 
   * @param {*} [skipNull]
   * @returns {*}
   */
  YueErData.get = function(expression, skipNull) {
    if (expression == null) {
      throw new Error('argumet "expression" is null/undefined');
    }

    skipNull = (skipNull || false);
    var selector = this.convertExpressionToSelector(expression);

    if (selector instanceof Array) {
      if (selector.length <= 0) {
        return {};
      }

      var elements = this.queryElementBySelector(selector);
      var values = {};

      for (var index = 0; index < elements.length; index++) {
        var element = elements[index];
        var value = this.doGetElementValue(element, skipNull);

        if (!skipNull || value != null) {
          var dataName = element.getAttribute(this.nameAttributeName);
          values[dataName] = value;
        }
      }

      return values;
    } else {
      var elements = this.queryElementBySelector(selector);
      if (elements.length <= 0) {
        return null;
      }

      return this.doGetElementValue(elements[0], skipNull);
    }
  };

  /**
   * 设置数据
   * 
   * @param {string|string[]} expression 
   * @param {*} value 
   * @param {*} [defaultNull]
   * @returns 
   */
  YueErData.set = function(expression, value, defaultNull) {
    if (expression == null) {
      throw new Error('argumet "expression" is null/undefined');
    }

    defaultNull = (defaultNull || false);
    var selector = this.convertExpressionToSelector(expression);

    if (selector instanceof Array) {
      if (selector.length <= 0) {
        return;
      }

      var elements = this.queryElementBySelector(selector);
      if (elements.length <= 0) {
        return;
      }

      for (var index = 0; index < elements.length; index++) {
        var element = elements[index];
        var dataName = element.getAttribute(this.nameAttributeName);
        var elementValue = (value != null)
          ? value[dataName] : null;

        if (elementValue != null || defaultNull) {
          this.doSetElementValue(element, elementValue, defaultNull);
        }
      }
    } else {
      var elements = queryElementBySelector(selector);
      if (elements.length <= 0) {
        return;
      }

      this.doSetElementValue(elements[0], value, defaultNull);
    }
  };

  /** 
   * 获取元素的值
   * 
   * @param {Document|Element} element 
   * @param {*} [skipNull]
   * @returns {*}
   */
  YueErData.doGetElementValue = function(element, skipNull) {
    var dataType = element.getAttribute(this.typeAttributeName);
    var handler = this.handlers[dataType];
    var value = handler.getValue(element, skipNull);

    return value;
  };

  /**
   * 设置元素的值
   * 
   * @param {Element} element 
   * @param {*} value 
   * @param {*} [defaultNull]
   */
  YueErData.doSetElementValue = function(element, value, defaultNull) {
    var dataType = element.getAttribute(this.typeAttributeName);
    var handler = this.handlers[dataType];

    handler.setValue(element, value, defaultNull);
  };

  /**
   * 根据选择器查找元素
   * 
   * @param {string|} selector 
   * @returns 
   */
  YueErData.queryElementBySelector = function(selector) {
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

    var selectors = [];
    var expressionArr = (expression instanceof Array)
      ? expression : [expression];

    for (var i = 0; i < expressionArr.length; i++) {
      var expressionStr = expressionArr[i];
      var selector;

      if (expressionStr === '*') { // "*"
        selector = '[' + YueErData.nameAttributeName + ']';
      } else if (expressionStr.length > 1 && expressionStr.charAt(expressionStr.length - 1) === '*') { // "a*"
        selector = '[' + YueErData.nameAttributeName + '^="' + expressionStr.slice(0, -1) + '"]';
      } else { // "a"
        selector = '[' + YueErData.nameAttributeName + '="' + expressionStr + '"]';
      }

      selectors.push(selector);
    }

    if (!(expression instanceof Array)) {
      return selectors[0];
    }

    return selectors;
  };

  /**
   * 添加前缀
   * 
   * @param {*} obj 
   * @param {*} prefix 
   * @returns 
   */
  YueErData.prefix = function(obj, prefix) {
    if (typeof prefix !== 'string') {
      throw new Error('argument#2 "prefix" required string');
    }
    
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    var newObj = {};
    var newKey;

    for (var key in obj) {
      newKey = prefix + key
      newObj[newKey] = obj[key];
    }

    return newObj;
  };

  /**
   * 去除前缀
   * 
   * @param {*} obj 
   * @param {*} unprefix 
   * @returns 
   */
  YueErData.unprefix = function(obj, unprefix) {
    if (typeof prefix !== 'string') {
      throw new Error('argument#2 "prefix" required string');
    }
    
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    var newObj = {};
    var newKey;

    for (var key in obj) {
      newKey = key.indexOf(prefix) === 0
        ? key.substring(prefix.length)
        : key;

      newObj[newKey] = obj[key];
    }

    return newObj;
  }

  /**
   * 创建对象
   * 
   * @param {*} baseElement 
   * @returns 
   */
  function createData(baseElement) {
    var yerData = Object.create(YueErData);
    yerData.baseElement = baseElement;

    return yerData;
  }

  /**
   * 注册处理器
   * 
   * @param {*} name 
   * @param {*} handler 
   */
  function registerHandler(name, handler) {
    YueErData.handlers[name] = handler;
  }

  if (typeof window != 'undefined') {
    global[namespace] = global[namespace] || {};
  }

  var _yer = (typeof window !== 'undefined')
    ? global[namespace] : global;

  _yer['config'] = YueErData;
  _yer['data'] = createData;
  _yer['registerHandler'] = registerHandler;
})((typeof window !== 'undefined' ? window : this), 'yer');
