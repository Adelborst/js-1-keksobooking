'use strict';

(function () {
  window.filter = {
    filterFactory: filterFactory,
    getFilters: getFilters
  };

  function getReducer(filtersObj) {
    return function (acc, key) {
      var filterType = key.split('-')[0];
      var filterName = key.split('-')[1];
      var filterValue = filtersObj[key];
      updateFilters(acc, filterType, filterName, filterValue);
      return acc;
    };
  }

  function updateFilters(filtersObj, filterType, filterName, filterValue) {
    if (filterType === 'filter') {
      updateFeatures(filtersObj, filterName, filterValue);
    } else if (filterType === 'housing') {
      updateHousing(filtersObj, filterName, filterValue);
    }
  }

  function updateFeatures(acc, featureName, filterValue) {
    if (filterValue) {
      if (acc.features) {
        acc.features.push(featureName);
      } else {
        acc.features = [featureName];
      }
    }
  }

  function updateHousing(acc, housing, value) {
    if (typeof value !== 'undefined' && value !== null && value !== 'any') {
      acc[housing] = value;
    }
  }

  function getFilters(filtersObj) {
    return Object.keys(filtersObj).reduce(getReducer(filtersObj), {});
  }

  function filterFactory(filtersMaps) {
    return function () {
      var args = Array.prototype.concat.apply([filtersMaps], arguments);
      return filter.apply(null, args);
    };
  }

  function filter(filtersMaps, ad, filtersValues) {
    return typeof filtersValues === 'undefined' || filtersValues === null ||
      filterByType(filtersValues.type, ad.offer.type) &&
      filterByPrice(filtersValues.price, ad.offer.price, filtersMaps.priceFilterRanges) &&
      filterByRooms(filtersValues.rooms, ad.offer.rooms) &&
      filterByGuests(filtersValues.guests, ad.offer.guests) &&
      filterByFeatures(filtersValues.features, ad.offer.features);
  }

  function filterByType(typeFilterValue, type) {
    return typeof typeFilterValue === 'undefined' ||
      typeFilterValue === null ||
      type === typeFilterValue;
  }

  function filterByRooms(roomsFilterValue, rooms) {
    return typeof roomsFilterValue === 'undefined' ||
      roomsFilterValue === null ||
      rooms === parseInt(roomsFilterValue, 10);
  }

  function filterByGuests(guestsFilterValue, guests) {
    return typeof guestsFilterValue === 'undefined' ||
      guestsFilterValue === null ||
      guests === parseInt(guestsFilterValue, 10);
  }

  function filterByPrice(priceFilterValue, price, priceFilterRanges) {
    if (!priceFilterValue) {
      return true;
    }
    var priceRange = priceFilterRanges[priceFilterValue];
    if (typeof priceRange === 'undefined' || priceRange === null) {
      throw new Error('Unhandled price range filter value ' + priceFilterValue);
    }
    var min = priceRange[0];
    var max = priceRange[1];
    if (typeof min === 'undefined' || min === null) {
      throw new Error('Price range filter\'s min value is not set');
    }
    if (typeof max === 'undefined' || max === null) {
      throw new Error('Price range filter\'s max value is not set');
    }
    return price >= min && price <= max;
  }

  function filterByFeatures(featuresFilterValues, features) {
    if (typeof featuresFilterValues !== 'undefined' && featuresFilterValues !== null) {
      for (var i = 0; i < featuresFilterValues.length; i++) {
        if (!features.includes(featuresFilterValues[i])) {
          return false;
        }
      }
    }
    return true;
  }
})();
