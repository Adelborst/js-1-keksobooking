'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var TYPES_DICTIONARY = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом'
  };

  window.showCard = function (els, ad) {
    var mapCard = els.map.querySelector('.map__card') || els.template.cloneNode(true);
    initMapCardEl(mapCard, ad);
    document.addEventListener('keydown', onEscClick);
    els.mapFiltersContainer.insertAdjacentElement('beforebegin', mapCard);
  };

  function onClickCloseMapCard(evt) {
    var mapCard = evt.target.closest('.map__card');
    closeMapCard(mapCard);
  }

  function closeMapCard(mapCard) {
    var activeMapPin = mapCard.parentElement.querySelector('.map__pin--active');
    var closeBtn = mapCard.querySelector('.popup__close');
    if (activeMapPin) {
      activeMapPin.classList.remove('map__pin--active');
    }
    mapCard.parentElement.removeChild(mapCard);
    mapCard.removeEventListener('click', onClickCloseMapCard);
    if (closeBtn) {
      closeBtn.removeEventListener('click', onClickCloseMapCard);
    }
    document.removeEventListener('keydown', onEscClick);
  }

  function onEscClick(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      var mapCard = document.querySelector('.map__card');
      closeMapCard(mapCard);
    }
  }

  function initMapCardEl(mapCard, ad) {
    var featuresListEl = mapCard.querySelector('.popup__features');
    var closeBtn = mapCard.querySelector('.popup__close');
    var featuresListItemEls = featuresListEl.querySelectorAll('.feature');
    mapCard.querySelector('.popup__avatar').src = ad.author.avatar;
    mapCard.querySelector('h3').textContent = ad.offer.title;
    mapCard.querySelector('p small').textContent = ad.offer.address;
    mapCard.querySelector('.popup__price').textContent = ad.offer.price + '\u20bd/ночь';
    mapCard.querySelector('h4').textContent = TYPES_DICTIONARY[ad.offer.type];
    mapCard.querySelector('h4 + p').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    mapCard.querySelector('h4 + p + p').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    setFeaturesVisibility(featuresListItemEls, ad.offer.features);
    mapCard.querySelector('.popup__features + p').textContent = ad.offer.description;
    if (closeBtn) {
      closeBtn.addEventListener('click', onClickCloseMapCard);
    }
    return mapCard;
  }

  function setFeaturesVisibility(featuresListItemEls, features) {
    for (var i = 0; i < featuresListItemEls.length; i++) {
      var feature = features.find(function (feat) {
        return featuresListItemEls[i].classList.contains('feature--' + feat);
      });
      featuresListItemEls[i].style.display = feature ? null : 'none';
    }
  }
})();
