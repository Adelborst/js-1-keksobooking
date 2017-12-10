'use strict';

(function () {
  var isInitialized = false;
  window.initMapPins = function (els, ads) {
    els.mapPinMain.addEventListener('mousedown', onMouseDown);

    function onMouseDown(evt) {
      evt.preventDefault();
      var target = evt.target.closest('.map__pin--main');
      var initialCoords = {
        x: target.clientX,
        y: target.clientY
      };
      var targetCoords = {
        x: initialCoords.x,
        y: initialCoords.y,
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      function onMouseMove(moveEvt) {
        moveEvt.preventDefault();
        var shift = {
          x: initialCoords.x - moveEvt.clientX,
          y: initialCoords.y - moveEvt.clientY,
        };

        initialCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        targetCoords = {
          x: target.offsetLeft - shift.x,
          y: target.offsetTop - shift.y
        };

        target.style.left = targetCoords.x + 'px';
        target.style.top = targetCoords.y + 'px';
      }

      function onMouseUp(mouseUpEvt) {
        mouseUpEvt.preventDefault();
        init();
        updateForm(els.noticeForm, targetCoords);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      function updateForm(form, coords) {
        // Координаты X и Y - это не координаты левого верхнего угла блока метки,
        // а координаты, на которые указывает метка своим острым концом.
        // Чтобы найти эту координату, нужно учесть размеры элемента с меткой.
        var x = coords.x + 62 / 2 + 10 / 2;
        var y = coords.y + 62 + 22;
        var addressInput = form.querySelector('#address');
        if (addressInput) {
          addressInput.value = 'x: ' + x + ', y: ' + y;
        }
      }
    }

    function init() {
      if (isInitialized) {
        return;
      }
      els.map.classList.remove('map--faded');
      els.noticeForm.classList.remove('notice__form--disabled');
      els.noticeForm.querySelector('.notice__header').removeAttribute('disabled');
      els.mapPinsContainer.addEventListener('click', onMapPinsContainerClick);

      var mapPins = [];
      for (var i = 0; i < ads.length; i++) {
        mapPins[i] = initMapPinEl(cloneMapPinEl(els.template), ads[i]);
      }
      renderMapPins(els.mapPinsContainer, mapPins);
      isInitialized = true;
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
