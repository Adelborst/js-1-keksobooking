'use strict';

(function () {
  // Выдержка из ТЗ:
  // 3.3. Обратите внимание на то, что координаты по X и Y,
  // соответствующие адресу, должны высчитываться не от левого верхнего угла блока с меткой,
  // а от середины нижней границы блока (от места, куда указывает метка своим острым концом).
  // 3.4. Чтобы метку невозможно было поставить выше горизонта или ниже панели фильтров,
  // значение координаты Y должно быть ограничено интервалом от 100 до 500.

  // По ТЗ считаем, что в пп. 3.3 и 3.4 речь идёт об одних и тех же координатах X и Y -
  // "место, куда указывает метка своим острым концом" -
  // Поскольку по тексту нет предпосылок считать по-другому
  // https://ibb.co/mcYex6
  // Если считаете, что это неправильно - исправляйте ТЗ
  // А пока в таком предположении с таким ТЗ получается,
  // что метка уезжает за горизонт и сильно недоезжает до фильтров
  var MAP_MIN_X = 0;
  var MAP_MIN_Y = 100;
  var MAP_MAX_Y = 500;

  var MAIN_PIN_OFFSET_X = 0;
  var MAIN_PIN_OFFSET_Y = Math.round(62 / 2 + 22);

  var PIN_OFFSET_X = 0;
  var PIN_OFFSET_Y = Math.round(44 / 2 + 18);

  window.pins = {
    initHandlers: initHandlers,
    initDrag: initDrag,
    renderAds: renderAds
  };

  function initHandlers(els, onMapPinActivated) {
    var onMapPinsClick = onMapPinsClickFactory(els, onMapPinActivated);
    els.mapPinsContainer.addEventListener('click', onMapPinsClick);
  }

  function initDrag(els, onDragEnd) {
    var dragContext = {
      els: els,
      target: null,
      initialCoords: null,
      targetCoords: null,
      onDragEnd: onDragEnd,
      getFinalCoords: function () {
        // Координаты X и Y - это не координаты левого верхнего угла блока метки,
        // а координаты, на которые указывает метка своим острым концом.
        // Чтобы найти эту координату, нужно учесть размеры элемента с меткой.
        return {
          x: this.targetCoords.x + MAIN_PIN_OFFSET_X,
          y: this.targetCoords.y + MAIN_PIN_OFFSET_Y,
        };
      }
    };
    dragContext.onMouseDown = onMouseDownFactory(dragContext);
    dragContext.onMouseMove = onMouseMoveFactory(dragContext);
    dragContext.onMouseUp = onMouseUpFactory(dragContext);
    els.mapPinMain.addEventListener('mousedown', dragContext.onMouseDown);
  }

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
      document.removeEventListener('mousemove', dragContext.onMouseMove);
      document.removeEventListener('mouseup', dragContext.onMouseUp);
      if (!window.utils.isEmpty(dragContext.onDragEnd)) {
        dragContext.onDragEnd(dragContext.getFinalCoords());
      }
    };
  }

  function renderAds(els, ads) {
    var mapPins = ads.map(function (ad) {
      return initMapPinEl(cloneMapPinEl(els.template), ad);
    });
    renderMapPins(els.mapPinsContainer, mapPins);
  }

  function onMapPinsClickFactory(els, onMapPinActivated) {
    return function (evt) {
      var mapPin = evt.target.closest('.map__pin');
      if (!mapPin || mapPin.classList.contains('map__pin--main')) {
        return;
      }
      switchActiveMapPin(mapPin);
      if (!window.utils.isEmpty(onMapPinActivated)) {
        onMapPinActivated(mapPin);
      }
    };
  }

  function getTargetCoords(target, shift) {
    var parentRect = target.parentElement.getBoundingClientRect();
    return {
      x: window.utils.getBoundedValue(target.offsetLeft - shift.x, MAP_MIN_X, parentRect.width),
      y: window.utils.getBoundedValue(target.offsetTop - shift.y, MAP_MIN_Y - MAIN_PIN_OFFSET_Y, MAP_MAX_Y - MAIN_PIN_OFFSET_Y)
    };
  }

  function cloneMapPinEl(template) {
    var mapPinTemplate = template.querySelector('.map__pin');
    return mapPinTemplate.cloneNode(true);
  }

  function initMapPinEl(mapPin, ad) {
    var avatarImg = mapPin.querySelector('img');
    mapPin.style.left = ad.location.x - PIN_OFFSET_X + 'px';
    mapPin.style.top = ad.location.y - PIN_OFFSET_Y + 'px';
    avatarImg.setAttribute('src', ad.author.avatar);
    mapPin.dataset.id = ad.id;
    return mapPin;
  }

  function renderMapPins(mapPinsContainer, mapPins) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < mapPins.length; i++) {
      fragment.appendChild(mapPins[i]);
    }
    removeExistingMapPins(mapPinsContainer);
    mapPinsContainer.appendChild(fragment);
  }

  function removeExistingMapPins(mapPinsContainer) {
    var existingMapPins = mapPinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var j = 0; j < existingMapPins.length; j++) {
      mapPinsContainer.removeChild(existingMapPins[j]);
    }
  }

  function switchActiveMapPin(mapPin) {
    var activeMapPin = mapPin.parentNode.querySelector('.map__pin--active');
    if (activeMapPin) {
      activeMapPin.classList.remove('map__pin--active');
    }
    mapPin.classList.add('map__pin--active');
  }
})();
