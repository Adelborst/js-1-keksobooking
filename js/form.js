'use strict';

(function () {
  // «Лачуга» — минимальная цена 0
  // «Квартира» — минимальная цена 1000
  // «Дом» — минимальная цена 5000
  // «Дворец» — минимальная цена 10000
  var TYPE_TO_MIN_PRICE_MAP = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  // 1 комната — «для одного гостя»
  // 2 комнаты — «для 2-х или 1-го гостя»
  // 3 комнаты — «для 2-х, 1-го или 3-х гостей»
  // 100 комнат — «не для гостей»
  var ROOM_NUMBER_TO_CAPACITIES_MAP = {
    1: ['1'],
    2: ['2', '1'],
    3: ['2', '1', '3'],
    100: ['0']
  };

  var CHECKIN_CHECKOUT_MAP = {
    '12:00': '12:00',
    '13:00': '13:00',
    '14:00': '14:00'
  };

  window.form = {
    init: init,
    enable: enable,
    resetFormFactory: resetFormFactory
  };

  function enable(els) {
    els.noticeForm.classList.remove('notice__form--disabled');
    enableDisabledElements(els);
    syncSelectBySourceSelect(els.roomNumber, els.capacity, Object.keys(ROOM_NUMBER_TO_CAPACITIES_MAP), Object.values(ROOM_NUMBER_TO_CAPACITIES_MAP));
  }

  function enableDisabledElements(formEls) {
    var disabledEls = formEls.noticeForm.querySelectorAll('[disabled]');
    disabledEls.forEach(function (disabledEl) {
      disabledEl.disabled = false;
    });
  }

  function init(els, onLoad, onError) {
    initSyncTimeInAndTimeOut(els.timeIn, els.timeOut, Object.keys(CHECKIN_CHECKOUT_MAP), Object.values(CHECKIN_CHECKOUT_MAP));
    initSyncTypeWithMinPrice(els.type, els.price, Object.keys(TYPE_TO_MIN_PRICE_MAP), Object.values(TYPE_TO_MIN_PRICE_MAP));
    initSyncRoomNumberWithCapacity(els.roomNumber, els.capacity, Object.keys(ROOM_NUMBER_TO_CAPACITIES_MAP), Object.values(ROOM_NUMBER_TO_CAPACITIES_MAP));
    initNotifyOnInvalidInput(els.noticeForm);
    initFormSubmission(els.noticeForm, onLoad, onError);
  }

  function initFormSubmission(formEl) {
    var restArgs = Array.prototype.slice.call(arguments, 1);
    var onFormSubmit = onFormSubmitFactory.apply(null, restArgs);
    formEl.addEventListener('submit', onFormSubmit);
  }

  function onFormSubmitFactory(onLoad, onError) {
    return function (evt) {
      evt.preventDefault();
      var formEl = evt.target;
      window.backend.save(new FormData(formEl), onLoad, onError);
    };
  }

  function initNotifyOnInvalidInput(formEl) {
    formEl.addEventListener('invalid', function (evt) {
      evt.target.style.borderColor = 'red';
    });
  }

  function resetFormFactory(formEls) {
    var titleValue = formEls.title.value;

    var typeSelectedIndex = formEls.type.selectedIndex;
    var priceMin = formEls.price.min;
    var priceValue = formEls.price.value;

    var timeInSelectedIndex = formEls.timeIn.selectedIndex;
    var timeOutSelectedIndex = formEls.timeOut.selectedIndex;

    var roomNumberSelectedIndex = formEls.roomNumber.selectedIndex;
    var capacitySelectedIndex = formEls.capacity.selectedIndex;

    var wifiChecked = formEls.featureWifi.checked;
    var dishwasherChecked = formEls.featureDishwasher.checked;
    var parkingChecked = formEls.featureParking.checked;
    var washerChecked = formEls.featureWasher.checked;
    var elevatorChecked = formEls.featureElevator.checked;
    var conditionerChecked = formEls.featureConditioner.checked;

    var descriptionValue = formEls.description.value;

    return function () {
      formEls.title.value = titleValue;

      formEls.type.selectedIndex = typeSelectedIndex;
      formEls.price.min = priceMin;
      formEls.price.value = priceValue;

      formEls.timeIn.selectedIndex = timeInSelectedIndex;
      formEls.timeOut.selectedIndex = timeOutSelectedIndex;

      formEls.roomNumber.selectedIndex = roomNumberSelectedIndex;
      formEls.capacity.selectedIndex = capacitySelectedIndex;
      syncSelectBySourceSelect(formEls.roomNumber, formEls.capacity, Object.keys(ROOM_NUMBER_TO_CAPACITIES_MAP), Object.values(ROOM_NUMBER_TO_CAPACITIES_MAP));

      formEls.featureWifi.checked = wifiChecked;
      formEls.featureDishwasher.checked = dishwasherChecked;
      formEls.featureParking.checked = parkingChecked;
      formEls.featureWasher.checked = washerChecked;
      formEls.featureElevator.checked = elevatorChecked;
      formEls.featureConditioner.checked = conditionerChecked;
      formEls.description.value = descriptionValue;
    };
  }

  function initSyncRoomNumberWithCapacity(roomNumberInput, capacityInput, roomNumberValues, capacityValues) {
    window.domUtils.selectFirstValidOption(capacityInput, roomNumberInput.value, Object.keys(ROOM_NUMBER_TO_CAPACITIES_MAP), Object.values(ROOM_NUMBER_TO_CAPACITIES_MAP));
    window.synchronizeFields(roomNumberInput, capacityInput, roomNumberValues, capacityValues, syncSelect);
  }

  function initSyncTypeWithMinPrice(typeInput, priceInput, typeValues, priceValues) {
    window.synchronizeFields(typeInput, priceInput, typeValues, priceValues, syncMin);
  }

  function initSyncTimeInAndTimeOut(timeInInput, timeOutInput, timeInValues, timeOutValues) {
    window.synchronizeFields(timeInInput, timeOutInput, timeInValues, timeOutValues, syncValue);
    window.synchronizeFields(timeOutInput, timeInInput, timeOutValues, timeInValues, syncValue);
  }

  function syncSelectBySourceSelect(srcSelectEl, targetSelectEl, srcOptionsValues, targetOptionsValues) {
    var availableTargetOptions = window.domUtils.getValidOptions(srcSelectEl.value, srcOptionsValues, targetOptionsValues);
    syncSelect(targetSelectEl, availableTargetOptions);
  }

  function syncSelect(selectEl, availableOptionsValues) {
    window.domUtils.setOptionsAvailability(selectEl, availableOptionsValues);
    window.domUtils.selectFirstEnabledOption(selectEl);
  }

  function syncValue(el, value) {
    el.value = value;
  }

  function syncMin(el, value) {
    el.min = value;
    el.value = Math.max(el.value, el.min);
  }
})();
