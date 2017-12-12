'use strict';

(function () {
  window.initMapPins = function (els, ads) {
    els.mapPinMain.addEventListener('mouseup', onMapPinMainDrop);

    function onMapPinMainDrop() {
      els.map.classList.remove('map--faded');
      els.noticeForm.classList.remove('notice__form--disabled');
      els.noticeForm.querySelector('.notice__header').removeAttribute('disabled');

      var mapPins = [];
      for (var i = 0; i < ads.length; i++) {
        mapPins[i] = initMapPinEl(cloneMapPinEl(els.template), ads[i]);
      }
      els.mapPinsContainer.addEventListener('click', onMapPinsContainerClick);
      renderMapPins(els.mapPinsContainer, mapPins);

      els.mapPinMain.removeEventListener('mouseup', onMapPinMainDrop);
    }

    function onMapPinsContainerClick(evt) {
      var mapPin = evt.target.closest('.map__pin');
      // ignore clicks on elements other than regular map pins
      if (!mapPin || mapPin.classList.contains('map__pin--main')) {
        return;
      }
      var ad = ads[mapPin.dataset.id];
      makeMapPinActive(evt.currentTarget, mapPin);
      window.showAdMapCard({
        map: els.map,
        mapFiltersContainer: els.mapFiltersContainer,
        template: els.template.querySelector('.map__card')
      }, ad);
    }
  };

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
    mapPin.dataset.id = ad.id;
    return mapPin;
  }

  function renderMapPins(container, mapPins) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < mapPins.length; i++) {
      fragment.appendChild(mapPins[i]);
    }
    container.appendChild(fragment);
  }

  function makeMapPinActive(mapPinsContainer, mapPin) {
    var activeMapPin = mapPinsContainer.querySelector('.map__pin--active');
    if (activeMapPin) {
      activeMapPin.classList.remove('map__pin--active');
    }
    mapPin.classList.add('map__pin--active');
  }
})();
