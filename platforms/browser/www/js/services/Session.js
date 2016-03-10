(function () {
  'use strict';

  function Session(configurationService, sessionsCache) {

    this.saveSession = function (session) {
      session.type = sessionsCache.KEY;
      sessionsCache.persist(session);
    };

    this.isComplete = function (sessionNumber) {
      var isComplete = false;
      var sessionData = sessionsCache.fetchAllRaw();
      if(sessionData){
        for(var i = 0; i < sessionData.length; i++) {
          if(sessionData[i].sessionType == this.SESSION_KEY_PREFIX + sessionNumber) {
            isComplete = true;
            break;
          }
        }
      }
      return isComplete;
    };
  }

  function SessionFactory(configurationService, sessionsCache) {
    return new Session(configurationService, sessionsCache);
  }

  angular.module('sis.services')
    .factory('sessionsService',
    ['configurationService', 'sessionsCache', SessionFactory]);
})();
