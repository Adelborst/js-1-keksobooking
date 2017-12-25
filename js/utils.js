'use strict';

(function () {
  function getRandomIntBetween(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomElement(arr) {
    return arr[getRandomIntBetween(0, arr.length - 1)];
  }

  function getRange(start, end) {
    var arr = [];
    for (var i = start; i <= end; i++) {
      arr.push(i);
    }
    return arr;
  }

  function pullRandomElement(arr) {
    var index = getRandomIntBetween(0, arr.length - 1);
    return arr.splice(index, 1)[0];
  }

  function getBoundedValue(value, min, max) {
    if (min > max) {
      throw new Error('min value ' + min + ' is greater than max value' + max);
    }
    if (!window.utils.isEmpty(min) && value < min) {
      value = min;
    } else if (!window.utils.isEmpty(max) && value > max) {
      value = max;
    }
    return value;
  }

  function debounce(func, timeout) {
    var timeoutId;
    return function () {
      var args = arguments;
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(function () {
        func.apply(null, args);
      }, timeout);
    };
  }

  function isEmpty(value) {
    return typeof value === 'undefined' || value === null;
  }

  window.utils = {
    getRandomIntBetween: getRandomIntBetween,
    getRandomElement: getRandomElement,
    getRange: getRange,
    pullRandomElement: pullRandomElement,
    getBoundedValue: getBoundedValue,
    debounce: debounce,
    isEmpty: isEmpty,
  };
})();
