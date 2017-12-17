'use strict';

(function () {
  var ADS_COUNT = 8;

  var templateEl = document.querySelector('template').content;
  var mapEl = document.querySelector('.map');
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

  var mapPinsEls = {
    template: templateEl,
    map: mapEl,
    mapFiltersContainer: mapFiltersContainerEl,
    mapPinMain: mapPinMainEl,
    mapPinsContainer: mapPinsContainerEl,
    noticeForm: noticeFormEl
  };
  window.backend.load(onAdsLoad, onError);

  function onAdsLoad(data) {
    var ads = data.slice(0, Math.min(ADS_COUNT, data.length));
    ads.forEach(function (ad, i) {
      ad.id = i;
    });
    window.initMapPins(mapPinsEls, ads);
  }

  function onError(errorMessage) {
    var el = document.createElement('div');
    el.style.margin = '0 auto';
    el.style.backgroundColor = 'red';
    el.innerText = errorMessage;
    el.style.fontSize = '30px';
    el.style.textAlign = 'center';
    el.style.position = 'fixed';
    el.style.zIndex = 1000000;
    el.style.width = '100%';
    el.style.left = 0;
    el.style.right = 0;
    document.body.insertAdjacentElement('afterbegin', el);
  }
})();
