(function () {
  'use strict';

  function RedCatInitializerController($http, $location, Routes) {

    var self = this;

    this.REDCAT_CONFIG_PATH = 'content/studies.json';
    this.studies = [];
    this.redCatInstance = {};

    this.setProtocol = function (){
      localStorage['REDCAT_INSTANCE'] = JSON.stringify(this.redCatInstance);
      $location.url(Routes.ENGINE_SELECTOR);

    }

    $http.get(this.REDCAT_CONFIG_PATH).success(function(data){self.studies = data;});

  }

  angular.module('sis.controllers')
    .controller('RedCatInitializerController',
    [ '$http','$location', 'Routes', RedCatInitializerController ]);
})();
