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
    initCapacityEl(roomNumberToCapacitiesMap[roomNumberInput.value], capacityInput);

    roomNumberInput.addEventListener('change', function (evt) {
      initCapacityEl(roomNumberToCapacitiesMap[evt.target.value], capacityInput);
    });
  }

  function initCapacityEl(capacityOptions, capacityInput) {
    for (var i = 0; i < capacityInput.childElementCount; i++) {
      var capacity = parseInt(capacityInput.children[i].value, 10);
      if (~capacityOptions.indexOf(capacity)) {
        capacityInput.children[i].removeAttribute('disabled');
      } else {
        capacityInput.children[i].setAttribute('disabled', '');
      }
    }
    var selectedOption = capacityInput.querySelector('option[selected]');
    // automatically select a different enabled option if current option has become disabled
    if (selectedOption && selectedOption.hasAttribute('disabled')) {
      selectedOption.removeAttribute('selected');
      var enabledOption = capacityInput.querySelector('option:not([disabled])');
      if (enabledOption) {
        enabledOption.setAttribute('selected', '');
      }
    }
  }

  function initSyncTypeWithMinPrice(typeInput, priceInput, typeToMinPriceMap) {
    typeInput.addEventListener('change', function (evt) {
      priceInput.setAttribute('min', typeToMinPriceMap[evt.target.value]);
    });
  }

  function initSyncTimeInAndTimeOut(timeInInput, timeOutInput) {
    timeInInput.addEventListener('change', onChange);
    timeOutInput.addEventListener('change', onChange);

    function onChange(evt) {
      timeOutInput.value = timeInInput.value = evt.target.value;
    }
  }
})();
