"use strict";

(function () {
  var ADS_COUNT = 8;

  var MIN_USER_ID = 1;
  var MAX_USER_ID = 8;

  var TITLES = [
    "Большая уютная квартира",
    "Маленькая неуютная квартира",
    "Огромный прекрасный дворец",
    "Маленький ужасный дворец",
    "Красивый гостевой домик",
    "Некрасивый негостеприимный домик",
    "Уютное бунгало далеко от моря",
    "Неуютное бунгало по колено в воде"
  ];

  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;

  var TYPES = [
    "flat",
    "house",
    "bungalo"
  ];

  var MIN_ROOMS_COUNT = 1;
  var MAX_ROOMS_COUNT = 5;

  var MIN_GUESTS_COUNT = 1;
  var MAX_GUESTS_COUNT = 8;

  var CHECKIN_TIMES = [
    "12:00",
    "13:00",
    "14:00"
  ];

  var CHECKOUT_TIMES = [
    "12:00",
    "13:00",
    "14:00"
  ];

  var FEATURES = [
    "wifi",
    "dishwasher",
    "parking",
    "washer",
    "elevator",
    "conditioner",
  ];

  var MIN_X = 300;
  var MAX_X = 900;
  var MIN_Y = 100;
  var MAX_Y = 500;

  var ads = getAds(ADS_COUNT);
  var mapPins = [];
  for(var i = 0; i < ads.length; i++) {
    var mapPin = createMapPinEl();
    updateMapPinEl(mapPin, ads[i]);
    mapPins[mapPins.length] = mapPin;
  }
  var fragment = prepareMapPinsElFragment(mapPins);
  document.querySelector(".map__pins").appendChild(fragment);

  function getRandomIntBetween(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getLocation() {
    return {
      x: getRandomIntBetween(MIN_X, MAX_X),
      y: getRandomIntBetween(MIN_Y, MAX_Y)
    }
  }

  function getRandomElement(arr) {
    return arr[getRandomIntBetween(0, arr.length - 1)];
  }

  function getUserAvatarUrl(userId) {
    userId = userId < 10 ? "0" + userId.toString() : userId.toString();
    return "img/avatars/user" + userId + ".png";
  }

  function getAddress(location) {
    return location.x + ", " + location.y;
  }

  function getPrice() {
    return getRandomIntBetween(MIN_PRICE, MAX_PRICE);
  }

  function getTitle(number) {
    return TITLES[number - 1];
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
    return "";
  }

  function getPhotos() {
    return [];
  }

  function createMapPinEl() {
    var mapPinTemplate = document.querySelector("#template").content.querySelector(".map__pin");
    return mapPinTemplate.cloneNode(true);
  }

  function updateMapPinEl(mapPinEl, ad) {
    var avatarImg = mapPinEl.querySelector("img");
    avatarImg.getpad
    var style = [
      "left: " + ad.location.x + "px",
      "top: " + ad.location.y + "px"
    ].join("; ").concat(";");
    mapPinEl.setAttribute("style", style);
    avatarImg.setAttribute("src", ad.author.avatar);
  }

  function prepareMapPinsElFragment(mapPins) {
    var fragment = document.createDocumentFragment();
    for(var i = 0; i < mapPins.length; i++) {
      fragment.appendChild(mapPins[i]);
    }
    return fragment;
  }

  function getAd(number) {
    var location = getLocation();
    return {
      author: {
        avatar: getUserAvatarUrl(number)
      },
      offer: {
        title: getTitle(number),
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

  function getAds(count) {
    var ads = [];
    for (var i = 1; i <= count; i++) {
      ads[ads.length] = getAd(i);
    }
    return ads;
  }
})();
