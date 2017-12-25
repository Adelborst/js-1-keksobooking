'use strict';

(function () {
  window.domUtils = {
    getValidOptions: getValidOptions,
    getOptionByValue: getSelectOptionByValue,
    getOptionIndexByValue: getSelectOptionIndexByValue,
    selectFirstValidOption: selectFirstValidOption,
    selectFirstEnabledOption: selectFirstEnabledOption,
    setOptionsAvailability: setOptionsAvailability
  };

  function getSelectOptionByValue(selectEl, value) {
    return Array.prototype.find.call(selectEl.children, function (optionEl) {
      return optionEl.value === value;
    });
  }

  function setOptionsAvailability(selectEl, availableOptionsValues) {
    Array.prototype.forEach.call(selectEl.children, function (optionEl) {
      optionEl.disabled = !~availableOptionsValues.indexOf(optionEl.value);
    });
  }

  function getValidOptions(srcValue, srcOptionsValues, targetOptionsValues) {
    var currentSrcValueIndex = srcOptionsValues.indexOf(srcValue);
    return targetOptionsValues[currentSrcValueIndex];
  }

  function getSelectOptionIndexByValue(selectEl, value) {
    return Array.prototype.indexOf.call(selectEl.children, getSelectOptionByValue(selectEl, value));
  }

  function selectFirstValidOption(targetSelectEl, srcValue, srcOptionsValues, targetOptionsValues) {
    var validOptions = getValidOptions(srcValue, srcOptionsValues, targetOptionsValues);
    if (!window.utils.isEmpty(validOptions) && !window.utils.isEmpty(validOptions[0])) {
      targetSelectEl.selectedIndex = getSelectOptionIndexByValue(targetSelectEl, validOptions[0]);
    }
  }

  function selectFirstEnabledOption(selectEl) {
    if (selectEl.children[selectEl.selectedIndex].disabled) {
      var enabledOptionEl = selectEl.querySelector('option:not([disabled])');
      selectEl.selectedIndex = Array.prototype.indexOf.call(selectEl.children, enabledOptionEl);
    }
  }

})();
