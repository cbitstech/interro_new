(function () {
  'use strict';

  function Configuration(localNotifications, $window, uuid) {

  }

  function ConfigurationFactory(configurationCache, localNotifications,
                                $window, uuid) {
    return new Configuration(configurationCache, localNotifications,
                             $window, uuid);
  }

  angular.module('sis.services')
    .factory('configurationService',
    ['localNotifications',
     '$window',
     'uuid',
     ConfigurationFactory]);
})();
