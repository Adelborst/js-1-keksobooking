'use strict';

(function () {
  var ADS_COUNT = 5;

  var templateEl = document.querySelector('template').content;
  var mapEl = document.querySelector('.map');
  var mapFiltersEl = mapEl.querySelector('.map__filters');
  var mapFiltersContainerEl = mapEl.querySelector('.map__filters-container');
  var mapPinsContainerEl = mapEl.querySelector('.map__pins');
  var mapPinMainEl = mapEl.querySelector('.map__pin--main');

  var noticeFormEl = document.querySelector('.notice__form');
  var avatarEl = noticeFormEl.querySelector('#avatar');
  var titleEl = noticeFormEl.querySelector('#title');
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

  var PRICE_RANGES = {
    'low': [0, 10000],
    'middle': [10000, 50000],
    'high': [50000, +Infinity]
  };

  var pinInitEls = {
    template: templateEl,
    map: mapEl,
    mapFiltersContainer: mapFiltersContainerEl,
    mapPinMain: mapPinMainEl,
    mapPinsContainer: mapPinsContainerEl,
    noticeForm: noticeFormEl
  };
  window.pins.initDrag(pinInitEls, onMainMapPinDragEnd);
  function onAdsLoad(data) {
    var ads = data.slice(0, Math.min(ADS_COUNT, data.length));
    ads.forEach(function (ad, i) {
      ad.id = i;
    });
    init(pinInitEls);
    window.pins.renderAds(pinInitEls, ads);
  }

  function onMainMapPinDragEnd(targetCoords) {
    window.backend.load(onAdsLoad, onError);
  }

  function onMapPinActivated(mapPin) {
    var adId = parseInt(mapPin.dataset.id, 10);
  }

  function init(els) {
    els.map.classList.remove('map--faded');
    els.noticeForm.classList.remove('notice__form--disabled');
    els.noticeForm.querySelector('.notice__header').removeAttribute('disabled');
    // var onMapPinsClick = onMapPinsClickFactory(els, onMapPinActivated);
    // els.mapPinsContainer.addEventListener('click', onMapPinsClick);
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

  window.mapFilters.init(mapFiltersEl, function (filter) {
    var fff = Object.keys(filter).reduce(function (acc, cur) {
      if (cur.startsWith('filter-')) {
        var feature = cur.split('-')[1];
        if (filter[cur]) {
          if (acc.features) {
            acc.features.push(feature);
          } else {
            acc.features = [feature];
          }
        }
      } else if (cur.startsWith('housing-')) {
        var housing = cur.split('-')[1];
        if (filter[cur] !== null && filter[cur] !== 'any') {
          acc[housing] = filter[cur];
        }
      }
      return acc;
    }, {});
    window.backend.load(function (data) {
      data = data.filter(function (d) {
        var result = true;
        result &= fff.price &&
          PRICE_RANGES[fff.price] &&
          d.offer.price >= PRICE_RANGES[fff.price][0] &&
          d.offer.price <= PRICE_RANGES[fff.price][1];
        return result;
      });
      var ads = data.slice(0, Math.min(ADS_COUNT, data.length));
      ads.forEach(function (ad, i) {
        ad.id = i;
      });
      window.pins.initDrag(pinInitEls, ads);
    }, onError);
  });
})();
