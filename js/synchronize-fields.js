'use strict';

(function () {
  window.synchronizeFields = function (srcField, targetField, srcValues, targetValues, syncFunc) {
    var onChange = onChangeFactory(targetField, srcValues, targetValues, syncFunc);
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
