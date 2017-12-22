'use strict';

(function () {

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

  window.getAds = function (count) {
    var userIdRange = window.utils.getRange(1, count);
    var titleIndexRange = window.utils.getRange(0, count - 1);
    var ads = [];
    for (var i = 0; i < count; i++) {
      var userId = window.utils.pullRandomElement(userIdRange);
      var titleIndex = window.utils.pullRandomElement(titleIndexRange);
      ads[i] = generateAd(i, userId, titleIndex);
    }
    return ads;
  };

  function generateAd(id, userId, titleIndex) {
    var location = generateLocation();
    return {
      id: id,
      author: {
        avatar: getUserAvatarUrl(userId)
      },
      offer: {
        title: getTitle(titleIndex),
        address: getAddress(location),
        price: generatePrice(),
        type: generateType(),
        rooms: generateRoomsCount(),
        guests: generateGuestsCount(),
        checkin: generateCheckinTime(),
        checkout: generateCheckoutTime(),
        features: generateFeatures(),
        description: getDescription(),
        photos: getPhotos(),
      },
      location: location,
    };
  }

  function generateLocation() {
    return {
      x: window.utils.getRandomIntBetween(MIN_LOCATION_X, MAX_LOCATION_X),
      y: window.utils.getRandomIntBetween(MIN_LOCATION_Y, MAX_LOCATION_Y)
    };
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

  function generatePrice() {
    return window.utils.getRandomIntBetween(MIN_PRICE, MAX_PRICE);
  }

  function getTitle(titleIndex) {
    return TITLES[titleIndex];
  }

  function generateRoomsCount() {
    return window.utils.getRandomIntBetween(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT);
  }

  function generateGuestsCount() {
    return window.utils.getRandomIntBetween(MIN_GUESTS_COUNT, MAX_GUESTS_COUNT);
  }

  function generateCheckinTime() {
    return window.utils.getRandomElement(CHECKIN_TIMES);
  }

  function generateCheckoutTime() {
    return window.utils.getRandomElement(CHECKOUT_TIMES);
  }

  function generateType() {
    return window.utils.getRandomElement(TYPES);
  }

  function generateFeatures() {
    var features = [];
    var featuresCount = window.utils.getRandomIntBetween(0, FEATURES.length);
    var featuresIndexRange = window.utils.getRange(0, featuresCount - 1);
    for (var i = 0; i < featuresCount; i++) {
      var featureIndex = window.utils.pullRandomElement(featuresIndexRange);
      features[i] = FEATURES[featureIndex];
    }
    return features.sort();
  }

  function getDescription() {
    return '';
  }

  function getPhotos() {
    return [];
  }
})();
