'use strict';

(function () {
  var LOAD_URL = 'https://1510.dump.academy/keksobooking/data';
  var SAVE_URL = 'https://1510.dump.academy/keksobooking';
  var STATUS_OK = 200;

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
      if (xhr.status === STATUS_OK) {
        if (!window.utils.isEmpty(onLoad)) {
          onLoad(xhr.response);
        }
      } else {
        if (!window.utils.isEmpty(onError)) {
          onError('Необработанный статус ' + xhr.status);
        }
      }
    });
    if (!window.utils.isEmpty(onError)) {
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
