(function() {
  'use strict';

  var Routes = {
    ROOT: '/',
    HOME: '/home',
    CONFIG: '/configure',
    SESSIONS: '/session',
    REDCAT: '/redcat_initializer',
    ENGINE_SELECTOR: '/engine_selector',
    PROMIS : '/promis'
  };

  angular.module('sis.constants')
         .constant('Routes', Routes);
})();
