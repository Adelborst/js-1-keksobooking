'use strict';

(function () {
  var isInitialized = false;

  window.initMapPins = function (els, ads) {
    var dragContext = {
      els: els,
      ads: ads,
      target: null,
      initialCoords: null,
      targetCoords: null
    };
    dragContext.onMouseDown = onMouseDownFactory(dragContext);
    dragContext.onMouseMove = onMouseMoveFactory(dragContext);
    dragContext.onMouseUp = onMouseUpFactory(dragContext);
    var initOnMouseUp = initOnMouseUpFactory(els, ads);
    els.mapPinMain.addEventListener('mousedown', dragContext.onMouseDown);
    els.map.addEventListener('mouseup', initOnMouseUp);
  };

  function onMouseDownFactory(dragContext) {
    return function (evt) {
      evt.preventDefault();
      dragContext.target = evt.target.closest('.map__pin--main');
      dragContext.initialCoords = {
        x: evt.clientX,
        y: evt.clientY
      };
      dragContext.targetCoords = {
        x: evt.clientX,
        y: evt.clientY
      };
      document.addEventListener('mousemove', dragContext.onMouseMove);
      document.addEventListener('mouseup', dragContext.onMouseUp);
    };
  }

  function onMouseMoveFactory(dragContext) {
    return function (evt) {
      evt.preventDefault();
      var shift = {
        x: dragContext.initialCoords.x - evt.clientX,
        y: dragContext.initialCoords.y - evt.clientY,
      };

      dragContext.initialCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      dragContext.targetCoords = getTargetCoords(dragContext.target, shift);

      dragContext.target.style.left = dragContext.targetCoords.x + 'px';
      dragContext.target.style.top = dragContext.targetCoords.y + 'px';
    };
  }

  function onMouseUpFactory(dragContext) {
    return function (evt) {
      evt.preventDefault();
      updateForm(dragContext.els.noticeForm, dragContext.targetCoords);
      document.removeEventListener('mousemove', dragContext.onMouseMove);
      document.removeEventListener('mouseup', dragContext.onMouseUp);
    };
  }

  function initOnMouseUpFactory(els, ads) {
    var onMouseUp = function (evt) {
      init(els, ads);
      var target = evt.target.closest('.map');
      target.removeEventListener('mouseup', onMouseUp);
    };
    return onMouseUp;
  }

  function init(els, ads) {
    if (isInitialized) {
      return;
    }
    els.map.classList.remove('map--faded');
    els.noticeForm.classList.remove('notice__form--disabled');
    els.noticeForm.querySelector('.notice__header').removeAttribute('disabled');
    els.mapPinsContainer.addEventListener('click', onMapPinsContainerClickFactory(els, ads));

    var mapPins = [];
    for (var i = 0; i < ads.length; i++) {
      mapPins[i] = initMapPinEl(cloneMapPinEl(els.template), ads[i]);
    }
    renderMapPins(els.mapPinsContainer, mapPins);
    isInitialized = true;
  }

  function onMapPinsContainerClickFactory(els, ads) {
    return function (evt) {
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
    };
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

  function getTargetCoords(target, shift) {
    var parentRect = target.parentElement.getBoundingClientRect();
    return {
      x: window.utils.getBoundedValue(target.offsetLeft - shift.x, 0, parentRect.width),
      y: window.utils.getBoundedValue(target.offsetTop - shift.y, 0, parentRect.height)
    };
  }

  function cloneMapPinEl(template) {
    var mapPinTemplate = template.querySelector('.map__pin');
    return mapPinTemplate.cloneNode(true);
  }

  function initMapPinEl(mapPin, ad) {
    var avatarImg = mapPin.querySelector('img');
    // Taking into account the size of the element
    // so that the map pin will point to the actual location
    var x = ad.location.x - 46 / 2;
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
