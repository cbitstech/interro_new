(function() {
  'use strict';

  function Resource($http, $window, settingsCache) {
    var RESOURCE_PATH = 'config.json',
        DEFAULT_DEVICE_ID = 'DUMMY-DEVICE';

    this.fetch = function fetch() {
      return $http.get(RESOURCE_PATH)
        .then(function(settings) {
          var settingsData = angular.copy(settings.data);

          // '$window.device.uuid' dependent on Cordova device plugin
          settingsData.clientUuid = $window.device.uuid || DEFAULT_DEVICE_ID;
          settingsCache.persist(settingsData);
        });
    };
  }

  function Settings($http, $window, settingsCache) {
    return new Resource($http, $window, settingsCache);
  }

  angular.module('sis.resources')
    .factory('settings', ['$http', '$window', 'settingsCache', Settings]);
})();
