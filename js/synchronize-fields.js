'use strict';

(function () {
  window.synchronizeFields = function (srcField) {
    var onChange = onChangeFactory.apply(null, Array.prototype.slice.call(arguments, 1));
    srcField.addEventListener('change', onChange);
  };

  function onChangeFactory(targetField, srcValues, targetValues, syncFunc) {
    return function (evt) {
      var srcValue = evt.target.value;
      var srcIndex = srcValues.indexOf(srcValue);
      var targetValue = targetValues[srcIndex];
      syncFunc(targetField, targetValue);
    };
  }
})();
