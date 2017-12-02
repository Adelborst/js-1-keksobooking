'use strict';

(function () {
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

  renderMap(generateAds(ADS_COUNT));

  function renderMap(ads) {
    document.querySelector('.map').classList.remove('map--faded');
    renderMapPins(ads);
    renderMapCard(ads[0]);
  }

  function renderMapPins(ads) {
    var mapPins = [];
    for (var i = 0; i < ads.length; i++) {
      mapPins[mapPins.length] = initMapPinEl(createMapPinEl(), ads[i]);
    }
    drawMapPins(mapPins);
  }

  function renderMapCard(ad) {
    var mapCardEl = initMapCard(createMapCardEl(), ad);
    document.querySelector('.map .map__filters-container').insertAdjacentElement('beforebegin', mapCardEl);
  }

  function createMapCardEl() {
    var template = document.querySelector('template').content;
    var mapCard = template.querySelector('article.map__card');
    return mapCard.cloneNode(true);
  }

  function initMapCard(mapCardEl, ad) {
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

  function drawMapPins(mapPins) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < mapPins.length; i++) {
      fragment.appendChild(mapPins[i]);
    }
    document.querySelector('.map__pins').appendChild(fragment);
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
    userId = parseInt(userId, 10);
    if (isNaN(userId) || userId < MIN_USER_ID || userId > MAX_USER_ID) {
      return null;
    }
    userId = userId < 10 ? '0' + userId.toString() : userId.toString();
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
    var featureIndices = [];
    var featureIndex;
    while (featureIndices.length < featuresCount) {
      featureIndex = getRandomIntBetween(0, FEATURES.length - 1);
      if (featureIndices.indexOf(featureIndex) === -1) {
        featureIndices[featureIndices.length] = featureIndex;
      }
    }
    featureIndices.sort();
    for (var i = 0; i < featureIndices.length; i++) {
      featureIndex = featureIndices[i];
      features[features.length] = FEATURES[featureIndex];
    }
    return features;
  }

  function getDescription() {
    return '';
  }

  function getPhotos() {
    return [];
  }

  function createMapPinEl() {
    var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
    return mapPinTemplate.cloneNode(true);
  }

  function initMapPinEl(mapPinEl, ad) {
    var avatarImg = mapPinEl.querySelector('img');
    // Taking into account the size of the element
    // so that the map pin will point to the actual location
    var x = ad.location.x - 23;
    var y = ad.location.y - 46 - 18;
    mapPinEl.style.left = x + 'px';
    mapPinEl.style.top = y + 'px';
    avatarImg.setAttribute('src', ad.author.avatar);
    return mapPinEl;
  }

  function getAd(userId, titleId) {
    var location = getLocation();
    return {
      author: {
        avatar: getUserAvatarUrl(userId)
      },
      offer: {
        title: getTitle(titleId),
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
      var titleIndex = pullRandomElement(titleIndexRange);
      var userId = pullRandomElement(userIdRange);
      ads[ads.length] = getAd(userId, titleIndex);
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
    return arr.splice(index, 1);
  }
})();
