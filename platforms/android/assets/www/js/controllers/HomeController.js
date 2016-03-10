(function () {
  'use strict';

  function HomeController(sessionsService, exerciseService,
                          exerciseAnswerService, $http) {

  }

  angular.module('sis.controllers')
    .controller('HomeController',
    [ 'sessionsService',
      'exerciseService',
      'exerciseAnswerService',
      '$http',
      HomeController]);
})();
