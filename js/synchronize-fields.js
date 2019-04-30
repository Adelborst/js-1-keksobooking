'use strict';

(function () {
  window.synchronizeFields = function (srcField) {
    var restArgs = Array.prototype.slice.call(arguments, 1);
    var onChange = onChangeFactory.apply(null, restArgs);
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
