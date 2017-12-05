'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var ADS_COUNT = 8;

  var MIN_USER_ID = 1;
  var MAX_USER_ID = 8;

  var TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];

  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;

  var TYPES = [
    'flat',
    'house',
    'bungalo'
  ];

  var TYPES_DICTIONARY = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом'
  };

  var MIN_ROOMS_COUNT = 1;
  var MAX_ROOMS_COUNT = 5;

  var MIN_GUESTS_COUNT = 1;
  var MAX_GUESTS_COUNT = 8;

  var CHECKIN_TIMES = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var CHECKOUT_TIMES = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner',
  ];

  var MIN_LOCATION_X = 300;
  var MAX_LOCATION_X = 900;
  var MIN_LOCATION_Y = 100;
  var MAX_LOCATION_Y = 500;

  // «Лачуга» — минимальная цена 0
  // «Квартира» — минимальная цена 1000
  // «Дом» — минимальная цена 5000
  // «Дворец» — минимальная цена 10000
  var TYPE_MIN_PRICE_MAP = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  // 1 комната — «для одного гостя»
  // 2 комнаты — «для 2-х или 1-го гостя»
  // 3 комнаты — «для 2-х, 1-го или 3-х гостей»
  // 100 комнат — «не для гостей»
  var ROOM_NUMBER_TO_CAPACITY_MAP = {
    1: [1],
    2: [2, 1],
    3: [2, 1, 3],
    100: [0]
  };

  var templateEl = document.querySelector('template').content;
  var mapEl = document.querySelector('.map');
  var mapFiltersContainerEl = mapEl.querySelector('.map__filters-container');
  var mapPinsEl = mapEl.querySelector('.map__pins');
  var mapPinMainEl = mapEl.querySelector('.map__pin--main');

  // notice form
  var noticeFormEl = document.querySelector('.notice__form');
  var timeInEl = document.querySelector('#timein');
  var timeOutEl = document.querySelector('#timeout');
  var typeEl = document.querySelector('#type');
  var priceEl = document.querySelector('#price');
  var roomNumberEl = document.querySelector('#room_number');
  var capacityEl = document.querySelector('#capacity');

  initUserInteractionScenarios({
    noticeForm: noticeFormEl,
    timeIn: timeInEl,
    timeOut: timeOutEl,
    type: typeEl,
    price: priceEl,
    roomNumber: roomNumberEl,
    capacity: capacityEl,
  });

  function initUserInteractionScenarios(els) {
    initSyncTimeInAndTimeOut(els.timeIn, els.timeOut);
    initSyncTypeWithMinPrice(els.type, els.price);
    initSyncRoomNumberWithCapacity(els.roomNumber, els.capacity);
    initNotifyOnInvalidInput(els.noticeForm);

    function initNotifyOnInvalidInput(form) {
      var inputEls = form.querySelectorAll('input, select, textarea');
      for (var i = 0; i < inputEls.length; i++) {
        inputEls[i].addEventListener('invalid', onInvalid);
      }

      function onInvalid(evt) {
        evt.target.style.borderColor = 'red';
      }
    }

    function initSyncRoomNumberWithCapacity(roomNumber, capacity) {
      initCapacityEl(ROOM_NUMBER_TO_CAPACITY_MAP[roomNumber.value]);

      roomNumber.addEventListener('change', function (evt) {
        var capacityOptions = ROOM_NUMBER_TO_CAPACITY_MAP[evt.target.value];
        initCapacityEl(capacityOptions);
      });

      function initCapacityEl(capacityOptions) {
        for (var i = 0; i < capacity.childElementCount; i++) {
          var enabled = capacityOptions.indexOf(parseInt(capacity.children[i].value, 10)) !== -1;
          if (enabled) {
            capacity.children[i].removeAttribute('disabled');
          } else {
            capacity.children[i].setAttribute('disabled', '');
          }
        }
        var selectedOption = capacity.querySelector('option[selected]');
        // automatically select a different enabled option if current option is disabled
        if (selectedOption && selectedOption.hasAttribute('disabled')) {
          selectedOption.removeAttribute('selected');
          var enabledOption = capacity.querySelector('option:not([disabled])');
          if (enabledOption) {
            enabledOption.setAttribute('selected', '');
          }
        }
      }
    }

    function initSyncTypeWithMinPrice(type, price) {

      type.addEventListener('change', function (evt) {
        price.setAttribute('min', TYPE_MIN_PRICE_MAP[evt.target.value]);
      });
    }

    function initSyncTimeInAndTimeOut(timeIn, timeOut) {
      timeIn.addEventListener('change', onChange);
      timeOut.addEventListener('change', onChange);

      function onChange(evt) {
        timeOut.value = timeIn.value = evt.target.value;
      }
    }
  }

  init({
    template: templateEl,
    map: mapEl,
    mapFiltersContainer: mapFiltersContainerEl,
    mapPinMain: mapPinMainEl,
    mapPins: mapPinsEl,
    noticeForm: noticeFormEl
  }, generateAds(ADS_COUNT));

  function init(els, ads) {
    els.mapPinMain.addEventListener('mouseup', onMapPinMainDrop);

    function onMapPinMainDrop() {
      els.map.classList.remove('map--faded');
      els.noticeForm.classList.remove('notice__form--disabled');
      els.noticeForm.querySelector('.notice__header').removeAttribute('disabled');

      var mapPins = [];
      for (var i = 0; i < ads.length; i++) {
        mapPins[i] = initMapPinEl(cloneMapPinEl(els.template), ads[i]);
        initActivateOnClick(mapPins[i]);
        initShowMapCardOnClick(els, mapPins[i], ads[i]);
      }
      renderMapPins(els.mapPins, mapPins);

      els.mapPinMain.removeEventListener('mouseup', onMapPinMainDrop);
    }
  }

  function initActivateOnClick(mapPin) {
    mapPin.addEventListener('click', function () {
      var activeMapPin = mapPin.parentElement.querySelector('.map__pin--active');
      if (activeMapPin) {
        activeMapPin.classList.remove('map__pin--active');
      }
      mapPin.classList.add('map__pin--active');
    });
  }

  function initShowMapCardOnClick(els, mapPin, ad) {
    mapPin.addEventListener('click', function () {
      var mapCard = els.map.querySelector('.map__card');
      if (mapCard) {
        mapCard.parentElement.removeChild(mapCard);
        document.removeEventListener('keydown', onEscClick);
      }
      mapCard = initMapCardEl(cloneMapCardEl(els.template), ad);
      mapCard.querySelector('.popup__close').addEventListener('click', closeMapCard);
      document.addEventListener('keydown', onEscClick);
      els.mapFiltersContainer.insertAdjacentElement('beforebegin', mapCard);

      function closeMapCard() {
        if (mapCard.parentElement) {
          var activeMapPin = mapCard.parentElement.querySelector('.map__pin--active');
          if (activeMapPin) {
            activeMapPin.classList.remove('map__pin--active');
          }
          mapCard.parentElement.removeChild(mapCard);
        }
        mapCard.querySelector('.popup__close').removeEventListener('click', closeMapCard);
      }

      function onEscClick(evt) {
        if (evt.keyCode === ESC_KEYCODE) {
          closeMapCard();
        }
      }
    });
  }

  function cloneMapCardEl(template) {
    var mapCard = template.querySelector('article.map__card');
    return mapCard.cloneNode(true);
  }

  function initMapCardEl(mapCardEl, ad) {
    mapCardEl.querySelector('.popup__avatar').setAttribute('src', ad.author.avatar);
    mapCardEl.querySelector('h3').textContent = ad.offer.title;
    mapCardEl.querySelector('p small').textContent = ad.offer.address;
    mapCardEl.querySelector('.popup__price').innerHTML = ad.offer.price + '&#x20bd;/ночь';
    mapCardEl.querySelector('h4').textContent = TYPES_DICTIONARY[ad.offer.type];
    mapCardEl.querySelector('h4 + p').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    mapCardEl.querySelector('h4 + p + p').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    var featuresListEl = mapCardEl.querySelector('.popup__features');
    initFeaturesListEl(featuresListEl, ad.offer.features);
    mapCardEl.querySelector('.popup__features + p').textContent = ad.offer.description;
    return mapCardEl;
  }

  function initFeaturesListEl(featuresListEl, features) {
    var featuresListItemEls = featuresListEl.querySelectorAll('.feature');
    for (var i = 0; i < featuresListItemEls.length; i++) {
      var feature = features.find(function (feat) {
        return featuresListItemEls[i].classList.contains('feature--' + feat);
      });
      if (!feature) {
        featuresListEl.removeChild(featuresListItemEls[i]);
      }
    }
    return featuresListEl;
  }

  function renderMapPins(container, mapPins) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < mapPins.length; i++) {
      fragment.appendChild(mapPins[i]);
    }
    container.appendChild(fragment);
  }

  function getRandomIntBetween(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getLocation() {
    return {
      x: getRandomIntBetween(MIN_LOCATION_X, MAX_LOCATION_X),
      y: getRandomIntBetween(MIN_LOCATION_Y, MAX_LOCATION_Y)
    };
  }

  function getRandomElement(arr) {
    return arr[getRandomIntBetween(0, arr.length - 1)];
  }

  function getUserAvatarUrl(userId) {
    if (isNaN(userId) || userId < MIN_USER_ID || userId > MAX_USER_ID) {
      return null;
    }
    userId = userId < 10 ? '0' + userId : userId;
    return 'img/avatars/user' + userId + '.png';
  }

  function getAddress(location) {
    return location.x + ', ' + location.y;
  }

  function getPrice() {
    return getRandomIntBetween(MIN_PRICE, MAX_PRICE);
  }

  function getTitle(titleIndex) {
    return TITLES[titleIndex];
  }

  function getRoomsCount() {
    return getRandomIntBetween(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT);
  }

  function getGuestsCount() {
    return getRandomIntBetween(MIN_GUESTS_COUNT, MAX_GUESTS_COUNT);
  }

  function getCheckinTime() {
    return getRandomElement(CHECKIN_TIMES);
  }

  function getCheckoutTime() {
    return getRandomElement(CHECKOUT_TIMES);
  }

  function getType() {
    return getRandomElement(TYPES);
  }

  function getFeatures() {
    var features = [];
    var featuresCount = getRandomIntBetween(0, FEATURES.length);
    var featuresIndexRange = getRange(0, featuresCount - 1);
    for (var i = 0; i < featuresCount; i++) {
      features[i] = FEATURES[pullRandomElement(featuresIndexRange)];
    }
    return features.sort();
  }

  function getDescription() {
    return '';
  }

  function getPhotos() {
    return [];
  }

  function cloneMapPinEl(template) {
    var mapPinTemplate = template.querySelector('.map__pin');
    return mapPinTemplate.cloneNode(true);
  }

  function initMapPinEl(mapPin, ad) {
    var avatarImg = mapPin.querySelector('img');
    // Taking into account the size of the element
    // so that the map pin will point to the actual location
    var x = ad.location.x - 23;
    var y = ad.location.y - 46 - 18;
    mapPin.style.left = x + 'px';
    mapPin.style.top = y + 'px';
    avatarImg.setAttribute('src', ad.author.avatar);
    return mapPin;
  }

  function getAd(userId, titleIndex) {
    var location = getLocation();
    return {
      author: {
        avatar: getUserAvatarUrl(userId)
      },
      offer: {
        title: getTitle(titleIndex),
        address: getAddress(location),
        price: getPrice(),
        type: getType(),
        rooms: getRoomsCount(),
        guests: getGuestsCount(),
        checkin: getCheckinTime(),
        checkout: getCheckoutTime(),
        features: getFeatures(),
        description: getDescription(),
        photos: getPhotos(),
      },
      location: location,
    };
  }

  function generateAds(count) {
    var userIdRange = getRange(1, count);
    var titleIndexRange = getRange(0, count - 1);
    var ads = [];
    for (var i = 0; i < count; i++) {
      ads[i] = getAd(pullRandomElement(userIdRange), pullRandomElement(titleIndexRange));
    }
    return ads;
  }

  function getRange(start, end) {
    var arr = [];
    for (var i = start; i <= end; i++) {
      arr.push(i);
    }
    return arr;
  }

  function pullRandomElement(arr) {
    var index = getRandomIntBetween(0, arr.length - 1);
    return arr.splice(index, 1)[0];
  }
})();
