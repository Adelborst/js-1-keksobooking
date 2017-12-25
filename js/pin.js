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
    var mapPinsEls = ads.map(function (ad) {
      return initMapPinEl(cloneMapPinEl(els.template), ad);
    });
    renderMapPins(els.mapPinsContainer, mapPinsEls);
  }

  function onMapPinsClickFactory(els, onMapPinActivated) {
    return function (evt) {
      var mapPinEl = evt.target.closest('.map__pin');
      if (!mapPinEl || mapPinEl.classList.contains('map__pin--main')) {
        return;
      }
      switchActiveMapPin(mapPinEl);
      if (!window.utils.isEmpty(onMapPinActivated)) {
        onMapPinActivated(mapPinEl);
      }
    };
  }

  function getTargetCoords(targetEl, shift) {
    var parentRect = targetEl.parentElement.getBoundingClientRect();
    return {
      x: window.utils.getBoundedValue(targetEl.offsetLeft - shift.x, MAP_MIN_X, parentRect.width),
      y: window.utils.getBoundedValue(targetEl.offsetTop - shift.y, MAP_MIN_Y - MAIN_PIN_OFFSET_Y, MAP_MAX_Y - MAIN_PIN_OFFSET_Y)
    };
  }

  function cloneMapPinEl(templateEl) {
    var mapPinTemplateEl = templateEl.querySelector('.map__pin');
    return mapPinTemplateEl.cloneNode(true);
  }

  function initMapPinEl(mapPinEl, ad) {
    var avatarImgEl = mapPinEl.querySelector('img');
    mapPinEl.style.left = ad.location.x - PIN_OFFSET_X + 'px';
    mapPinEl.style.top = ad.location.y - PIN_OFFSET_Y + 'px';
    avatarImgEl.setAttribute('src', ad.author.avatar);
    mapPinEl.dataset.id = ad.id;
    return mapPinEl;
  }

  function renderMapPins(mapPinsContainerEl, mapPinsEls) {
    var fragment = document.createDocumentFragment();
    mapPinsEls.forEach(function (mapPinEl) {
      fragment.appendChild(mapPinEl);
    });
    removeExistingMapPins(mapPinsContainerEl);
    mapPinsContainerEl.appendChild(fragment);
  }

  function removeExistingMapPins(mapPinsContainerEl) {
    var existingMapPinsEls = mapPinsContainerEl.querySelectorAll('.map__pin:not(.map__pin--main)');
    existingMapPinsEls.forEach(function (mapPinEl) {
      mapPinsContainerEl.removeChild(mapPinEl);
    });
  }

  function switchActiveMapPin(mapPinEl) {
    var activeMapPinEl = mapPinEl.parentNode.querySelector('.map__pin--active');
    if (activeMapPinEl) {
      activeMapPinEl.classList.remove('map__pin--active');
    }
    mapPinEl.classList.add('map__pin--active');
  }
})();
