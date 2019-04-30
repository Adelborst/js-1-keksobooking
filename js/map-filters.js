'use strict';

(function () {
  function init(form, callback) {
    var fields = getFormFields(form);
    fields.forEach(function (field) {
      field.addEventListener('change', function () {
        callback(getFieldsIdToValue(fields));
      });
    });
  }

  window.mapFilters = {
    init: init,
    getFormFiltersValues: getFormFiltersValues,
  };

  function getFormFields(form) {
    return Array.from(form.querySelectorAll('input[id], select[id], textarea[id]'));
  }

  function getFormFiltersValues(form) {
    var fields = getFormFields(form);
    return getFieldsIdToValue(fields);
  }

  function getFieldsIdToValue(fields) {
    return fields.reduce(function (acc, field) {
      acc[field.id] = getFieldValue(field);
      return acc;
    }, {});
  }

  function getFieldValue(field) {
    if (field.tagName.toLowerCase() === 'input') {
      if (field.type === 'checkbox') {
        return field.checked;
      }
      return field.value;
    }
    if (field.tagName.toLowerCase() === 'select') {
      return field.children[field.selectedIndex].value;
    }
    throw new Error('unhandled field tag name ' + field.tagName);
  }
})();
