'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var TYPES_DICTIONARY = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом'
  };

  window.showAdMapCard = function (els, ad) {
    var mapCard = els.map.querySelector('.map__card');
    if (mapCard) {
      mapCard.parentElement.removeChild(mapCard);
    }
    mapCard = initMapCardEl(els.template.cloneNode(true), ad);
    document.addEventListener('keydown', onEscClick);
    els.mapFiltersContainer.insertAdjacentElement('beforebegin', mapCard);
  };

  function onClickCloseMapCard(evt) {
    var mapCard = evt.target.closest('.map__card');
    closeMapCard(mapCard);
  }

  function closeMapCard(mapCard) {
    var activeMapPin = mapCard.parentElement.querySelector('.map__pin--active');
    if (activeMapPin) {
      activeMapPin.classList.remove('map__pin--active');
    }
    mapCard.parentElement.removeChild(mapCard);
    mapCard.removeEventListener('click', onClickCloseMapCard);
    var closeBtn = mapCard.querySelector('.popup__close');
    if (closeBtn) {
      closeBtn.removeEventListener('click', onClickCloseMapCard);
    }
    mapCard.removeEventListener('keydown', onEscClick);
  }

  function onEscClick(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      var mapCard = document.querySelector('.map__card');
      closeMapCard(mapCard);
    }
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
    var closeBtn = mapCardEl.querySelector('.popup__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', onClickCloseMapCard);
    }
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

})();
