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
    1: [1],
    2: [2, 1],
    3: [2, 1, 3],
    100: [0]
  };

  var CHECKIN_CHECKOUT_MAP = {
    '12:00': '12:00',
    '13:00': '13:00',
    '14:00': '14:00'
  };

  window.initForm = function (els) {
    initSyncTimeInAndTimeOut(els.timeIn, els.timeOut);
    initSyncTypeWithMinPrice(els.type, els.price, TYPE_TO_MIN_PRICE_MAP);
    initSyncRoomNumberWithCapacity(els.roomNumber, els.capacity, ROOM_NUMBER_TO_CAPACITIES_MAP);
    initNotifyOnInvalidInput(els.noticeForm);
  };

  function initNotifyOnInvalidInput(form) {
    form.addEventListener('invalid', function (evt) {
      evt.target.style.borderColor = 'red';
    });
  }

  function initSyncRoomNumberWithCapacity(roomNumberInput, capacityInput, roomNumberToCapacitiesMap) {
    initSelect(capacityInput, roomNumberToCapacitiesMap[roomNumberInput.value]);
    window.synchronizeFields(roomNumberInput, capacityInput, Object.keys(roomNumberToCapacitiesMap), Object.values(roomNumberToCapacitiesMap), initSelect);
  }

  function initSyncTypeWithMinPrice(typeInput, priceInput, typeToMinPriceMap) {
    window.synchronizeFields(typeInput, priceInput, Object.keys(typeToMinPriceMap), Object.values(typeToMinPriceMap), syncMin);
  }

  function initSyncTimeInAndTimeOut(timeInInput, timeOutInput) {
    window.synchronizeFields(timeInInput, timeOutInput, Object.keys(CHECKIN_CHECKOUT_MAP), Object.values(CHECKIN_CHECKOUT_MAP), syncValue);
    window.synchronizeFields(timeOutInput, timeInInput, Object.values(CHECKIN_CHECKOUT_MAP), Object.keys(CHECKIN_CHECKOUT_MAP), syncValue);
  }

  function initSelect(select, optionsValues) {
    for (var i = 0; i < select.childElementCount; i++) {
      var optionValue = parseInt(select.children[i].value, 10);
      select.children[i].disabled = !~optionsValues.indexOf(optionValue);
    }
    if (select.children[select.selectedIndex].hasAttribute('disabled')) {
      var enabledOption = select.querySelector('option:not([disabled])');
      select.selectedIndex = Array.prototype.indexOf.call(select.children, enabledOption);
    }
  }

  function syncValue(element, value) {
    element.value = value;
  }

  function syncMin(element, value) {
    element.min = value;
    element.value = Math.max(element.value, element.min);
  }
})();
