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

  window.utils = {
    getRandomIntBetween: getRandomIntBetween,
    getRandomElement: getRandomElement,
    getRange: getRange,
    pullRandomElement: pullRandomElement
  };
})();
