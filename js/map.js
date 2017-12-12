'use strict';

(function () {
  var ADS_COUNT = 8;

  var templateEl = document.querySelector('template').content;
  var mapEl = document.querySelector('.map');
  var mapFiltersContainerEl = mapEl.querySelector('.map__filters-container');
  var mapPinsContainerEl = mapEl.querySelector('.map__pins');
  var mapPinMainEl = mapEl.querySelector('.map__pin--main');

  var noticeFormEl = document.querySelector('.notice__form');
  var timeInEl = document.querySelector('#timein');
  var timeOutEl = document.querySelector('#timeout');
  var typeEl = document.querySelector('#type');
  var priceEl = document.querySelector('#price');
  var roomNumberEl = document.querySelector('#room_number');
  var capacityEl = document.querySelector('#capacity');

  var formEls = {
    noticeForm: noticeFormEl,
    timeIn: timeInEl,
    timeOut: timeOutEl,
    type: typeEl,
    price: priceEl,
    roomNumber: roomNumberEl,
    capacity: capacityEl,
  };
  window.initForm(formEls);

  var mapPinsEls = {
    template: templateEl,
    map: mapEl,
    mapFiltersContainer: mapFiltersContainerEl,
    mapPinMain: mapPinMainEl,
    mapPinsContainer: mapPinsContainerEl,
    noticeForm: noticeFormEl
  };
  var ads = window.getAds(ADS_COUNT);
  window.initMapPins(mapPinsEls, ads);
})();
