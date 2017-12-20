'use strict';

(function () {
  var ADS_COUNT = 5;
  var DEBOUNCE_TIMEOUT = 500;

  var debouncedLoad = window.utils.debounce(window.backend.load, DEBOUNCE_TIMEOUT);

  var PRICE_FILTER_RANGES = {
    'low': [0, 10000],
    'middle': [10000, 50000],
    'high': [50000, +Infinity]
  };

  var filter = window.filter.filterFactory({
    priceFilterRanges: PRICE_FILTER_RANGES
  });

  var ads = [];
  var filters;

  var templateEl = document.querySelector('template').content;
  var mapCardTemplateEl = templateEl.querySelector('.map__card');

  var mapEl = document.querySelector('.map');
  var mapFiltersEl = mapEl.querySelector('.map__filters');
  var mapFiltersContainerEl = mapEl.querySelector('.map__filters-container');
  var mapPinsContainerEl = mapEl.querySelector('.map__pins');
  var mapPinMainEl = mapEl.querySelector('.map__pin--main');

  var noticeFormEl = document.querySelector('.notice__form');
  var avatarEl = noticeFormEl.querySelector('#avatar');
  var titleEl = noticeFormEl.querySelector('#title');
  var addressEl = noticeFormEl.querySelector('#address');
  var timeInEl = noticeFormEl.querySelector('#timein');
  var timeOutEl = noticeFormEl.querySelector('#timeout');
  var typeEl = noticeFormEl.querySelector('#type');
  var priceEl = noticeFormEl.querySelector('#price');
  var roomNumberEl = noticeFormEl.querySelector('#room_number');
  var capacityEl = noticeFormEl.querySelector('#capacity');
  var featureWifiEl = noticeFormEl.querySelector('#feature-wifi');
  var featureDishwasherEl = noticeFormEl.querySelector('#feature-dishwasher');
  var featureParkingEl = noticeFormEl.querySelector('#feature-parking');
  var featureWasherEl = noticeFormEl.querySelector('#feature-washer');
  var featureElevatorEl = noticeFormEl.querySelector('#feature-elevator');
  var featureConditionerEl = noticeFormEl.querySelector('#feature-conditioner');
  var descriptionEl = noticeFormEl.querySelector('#description');
  var imagesEl = noticeFormEl.querySelector('#images');

  var formEls = {
    noticeForm: noticeFormEl,
    avatar: avatarEl,
    title: titleEl,
    address: addressEl,
    timeIn: timeInEl,
    timeOut: timeOutEl,
    type: typeEl,
    price: priceEl,
    roomNumber: roomNumberEl,
    capacity: capacityEl,
    featureWifi: featureWifiEl,
    featureDishwasher: featureDishwasherEl,
    featureParking: featureParkingEl,
    featureWasher: featureWasherEl,
    featureElevator: featureElevatorEl,
    featureConditioner: featureConditionerEl,
    description: descriptionEl,
    images: imagesEl,
  };
  window.initForm(formEls, onError);

  var pinInitEls = {
    template: templateEl,
    map: mapEl,
    mapFiltersContainer: mapFiltersContainerEl,
    mapPinMain: mapPinMainEl,
    mapPinsContainer: mapPinsContainerEl,
    noticeForm: noticeFormEl
  };
  window.pins.initDrag(pinInitEls, onMainMapPinDragEnd);
  window.pins.initHandlers(pinInitEls, onMapPinActivated);
  pinInitEls.mapPinMain.addEventListener('mousedown', onMainMapPinMouseDown);
  window.mapFilters.init(mapFiltersEl, onMapFiltersChange);

  function init(els) {
    els.map.classList.remove('map--faded');
    els.noticeForm.classList.remove('notice__form--disabled');
    els.noticeForm.querySelector('.notice__header').removeAttribute('disabled');
  }

  function onAdsLoad(data) {
    ads = data.filter(function (ad) {
      return filter(ad, filters);
    }).slice(0, Math.min(ADS_COUNT, data.length));
    ads.forEach(function (ad, index) {
      ad.id = index;
    });
    window.pins.renderAds(pinInitEls, ads);
  }

  function onMapFiltersChange(filtersObj) {
    filters = window.filter.getFilters(filtersObj);
    debouncedLoad(onAdsLoad, onError);
  }

  function onMainMapPinMouseDown() {
    document.addEventListener('mouseup', onMainMapPinMouseUp);
  }

  function onMainMapPinMouseUp() {
    init(pinInitEls);
    window.backend.load(onAdsLoad, onError);
    document.removeEventListener('mouseup', onMainMapPinMouseUp);
  }

  function onMainMapPinDragEnd(coords) {
    addressEl.value = 'x: ' + coords.x + ', y: ' + coords.y;
  }

  function onMapPinActivated(mapPin) {
    var adId = parseInt(mapPin.dataset.id, 10);
    var ad = ads.find(function (a) {
      return a.id === adId;
    });
    window.showCard({
      map: pinInitEls.map,
      mapFiltersContainer: pinInitEls.mapFiltersContainer,
      template: mapCardTemplateEl
    }, ad);
  }

  function onError(errorMessage) {
    var el = document.createElement('div');
    el.style.margin = '0 auto';
    el.style.backgroundColor = 'red';
    el.style.fontSize = '30px';
    el.style.textAlign = 'center';
    el.style.position = 'fixed';
    el.style.zIndex = 1000000;
    el.style.width = '100%';
    el.style.left = 0;
    el.style.right = 0;
    el.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', el);
  }
})();
