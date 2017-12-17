'use strict';

(function () {
  var LOAD_URL = 'https://1510.dump.academy/keksobooking/data';
  var SAVE_URL = 'https://1510.dump.academy/keksobooking';

  function load(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    addCommonEventListeners(xhr, onLoad, onError);
    xhr.open('GET', LOAD_URL);
    xhr.send();
  }

  function save(data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    addCommonEventListeners(xhr, onLoad, onError);
    xhr.open('POST', SAVE_URL);
    xhr.send(data);
  }

  function addCommonEventListeners(xhr, onLoad, onError) {
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        if (typeof onLoad !== 'undefined' && onLoad !== null) {
          onLoad(xhr.response);
        }
      } else {
        if (typeof onError !== 'undefined' && onError !== null) {
          onError('Необработанный статус ' + xhr.status);
        }
      }
    });
    if (typeof onError !== 'undefined' && onError !== null) {
      xhr.addEventListener('error', function () {
        onError('Ошибка');
      });

      xhr.addEventListener('timeout', function () {
        onError('Таймаут');
      });
    }
  }

  window.backend = {
    load: load,
    save: save
  };
})();
