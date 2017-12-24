'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var TYPES_DICTIONARY = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом'
  };

  window.showCard = function (els, ad) {
    var mapCardEl = els.map.querySelector('.map__card') || els.template.cloneNode(true);
    initMapCardEl(mapCardEl, ad);
    document.addEventListener('keydown', onEscClick);
    els.mapFiltersContainer.insertAdjacentElement('beforebegin', mapCardEl);
  };

  function onClickCloseMapCard(evt) {
    var mapCardEl = evt.target.closest('.map__card');
    closeMapCard(mapCardEl);
  }

  function closeMapCard(mapCard) {
    var activeMapPinEl = mapCard.parentElement.querySelector('.map__pin--active');
    var closeBtnEl = mapCard.querySelector('.popup__close');
    if (activeMapPinEl) {
      activeMapPinEl.classList.remove('map__pin--active');
    }
    mapCard.parentElement.removeChild(mapCard);
    mapCard.removeEventListener('click', onClickCloseMapCard);
    if (closeBtnEl) {
      closeBtnEl.removeEventListener('click', onClickCloseMapCard);
    }
    document.removeEventListener('keydown', onEscClick);
  }

  function onEscClick(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      var mapCardEl = document.querySelector('.map__card');
      closeMapCard(mapCardEl);
    }
  }

  function initMapCardEl(mapCardEl, ad) {
    var featuresListEl = mapCardEl.querySelector('.popup__features');
    var closeBtnEl = mapCardEl.querySelector('.popup__close');
    var featuresListItemsEls = featuresListEl.querySelectorAll('.feature');
    mapCardEl.querySelector('.popup__avatar').src = ad.author.avatar;
    mapCardEl.querySelector('h3').textContent = ad.offer.title;
    mapCardEl.querySelector('p small').textContent = ad.offer.address;
    mapCardEl.querySelector('.popup__price').textContent = ad.offer.price + '\u20bd/ночь';
    mapCardEl.querySelector('h4').textContent = TYPES_DICTIONARY[ad.offer.type];
    mapCardEl.querySelector('h4 + p').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    mapCardEl.querySelector('h4 + p + p').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    setFeaturesVisibility(featuresListItemsEls, ad.offer.features);
    mapCardEl.querySelector('.popup__features + p').textContent = ad.offer.description;
    if (closeBtnEl) {
      closeBtnEl.addEventListener('click', onClickCloseMapCard);
    }
    return mapCardEl;
  }

  function setFeaturesVisibility(featuresListItemsEls, features) {
    for (var i = 0; i < featuresListItemsEls.length; i++) {
      var feature = features.find(function (feat) {
        return featuresListItemsEls[i].classList.contains('feature--' + feat);
      });
      featuresListItemsEls[i].style.display = feature ? null : 'none';
    }
  }
})();
