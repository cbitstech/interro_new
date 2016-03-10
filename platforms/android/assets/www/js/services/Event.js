(function () {
  'use strict';

  function Event($location, $window) {
    this.handleBackButton = function() {
      // URL Constants
      var SESSION_PATH = 'session';
      var EMA_MORNING_PATH = 'morning';
      var EMA_EVENING_PATH = 'evening';

      // capture back button and handle it based on current path
      var pathName = $location.url();
      var endPoint = pathName.substring(pathName.lastIndexOf('/') + 1, pathName.length);

      if(endPoint !== SESSION_PATH &&
        endPoint !== EMA_MORNING_PATH &&
        endPoint !== EMA_EVENING_PATH) {
        $window.history.back();
      }
    };
  }

  function EventFactory($location, $window) {
    return new Event($location, $window);
  }

  angular.module('sis.services')
    .factory('eventService', ['$location', '$window', EventFactory]);
})();
