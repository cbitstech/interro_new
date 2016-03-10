(function () {
  'use strict';

  function SetUpController(configurationService, $modal, configurationModalService) {
    this.cessationDate = null;

    this.getCessationDate = function () {
      return configurationService.getCessationDate();
    };

    this.setCessationDate = function () {
      configurationService.saveCessationDate(this.cessationDate);
    };

    this.configurationComplete = function () {
      return configurationService.configurationComplete();
    };

    this.openRiskyTimesModal = function () {
      configurationModalService.openRiskyTimesModal($modal);
    };

    this.openCessationReasonsModal = function () {
      configurationModalService.openCessationReasonsModal($modal);
    };

    this.openSocialSupportModal = function() {
      configurationModalService.openSocialSupportModal($modal);
    };
  }

  angular.module('sis.controllers')
    .controller('SetUpController',
    ['configurationService', '$modal', 'configurationModalService', SetUpController]);
})();
