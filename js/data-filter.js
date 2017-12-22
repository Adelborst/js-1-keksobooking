'use strict';

(function () {
  window.filter = {
    filterFactory: filterFactory,
    getFilters: getFilters
  };

  function updateFilters(filtersObj, filterType, filterName, filterValue) {
    if (filterType === 'filter') {
      updateFeatures(filtersObj, filterName, filterValue);
    } else if (filterType === 'housing') {
      updateHousing(filtersObj, filterName, filterValue);
    }
  }

  function updateFeatures(acc, featureName, filterValue) {
    if (filterValue) {
      acc.features = (acc.features || []).concat(featureName);
    }
  }

  function updateHousing(acc, housing, value) {
    if (!window.utils.isEmpty(value) && value !== 'any') {
      acc[housing] = value;
    }
  }

  function getFilters(filtersObj) {
    return Object.keys(filtersObj).reduce(function (acc, key) {
      var splitted = key.split('-');
      var filterType = splitted[0];
      var filterName = splitted[1];
      var filterValue = filtersObj[key];
      updateFilters(acc, filterType, filterName, filterValue);
      return acc;
    }, {});
  }

  function filterFactory(filtersMaps) {
    return function () {
      var args = Array.prototype.concat.apply([filtersMaps], arguments);
      return filterAd.apply(null, args);
    };
  }

  function filterAd(filtersMaps, ad, filtersValues) {
    return window.utils.isEmpty(filtersValues) ||
      filterByType(filtersValues.type, ad.offer.type) &&
      filterByPrice(filtersValues.price, ad.offer.price, filtersMaps.priceFilterRanges) &&
      filterByRooms(filtersValues.rooms, ad.offer.rooms) &&
      filterByGuests(filtersValues.guests, ad.offer.guests) &&
      filterByFeatures(filtersValues.features, ad.offer.features);
  }

  function filterByType(typeFilterValue, type) {
    return window.utils.isEmpty(typeFilterValue) ||
      type === typeFilterValue;
  }

  function filterByRooms(roomsFilterValue, rooms) {
    return window.utils.isEmpty(roomsFilterValue) ||
      rooms === parseInt(roomsFilterValue, 10);
  }

  function filterByGuests(guestsFilterValue, guests) {
    return window.utils.isEmpty(guestsFilterValue) ||
      guests === parseInt(guestsFilterValue, 10);
  }

  function filterByPrice(priceFilterValue, price, priceFilterRanges) {
    if (!priceFilterValue) {
      return true;
    }
    var priceRange = priceFilterRanges[priceFilterValue];
    if (window.utils.isEmpty(priceRange)) {
      throw new Error('Unhandled price range filter value ' + priceFilterValue);
    }
    var min = priceRange[0];
    var max = priceRange[1];
    if (window.utils.isEmpty(min)) {
      throw new Error('Price range filter\'s min value is not set');
    }
    if (window.utils.isEmpty(max)) {
      throw new Error('Price range filter\'s max value is not set');
    }
    return price >= min && price <= max;
  }

  function filterByFeatures(featuresFilterValues, features) {
    return window.utils.isEmpty(featuresFilterValues) || featuresFilterValues.every(function (featuresFilterValue) {
      return features.includes(featuresFilterValue);
    });
  }
})();
