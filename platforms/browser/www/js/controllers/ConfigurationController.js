(function() {
  'use strict';

  var CONFIG_TOKEN_LENGTH = 5;

  function ConfigurationController($route, $location, authenticationToken, Routes, connection) {
    var self = this;
    this.configurationToken = '';
    this.alert = '';

    this.createAuthenticationToken = function createAuthenticationToken() {
      if (this.configurationToken.length < CONFIG_TOKEN_LENGTH) {
        return;
      }
      authenticationToken.create(this.configurationToken)
          .then(function() {
            $location.url(Routes.SESSIONS);
          })
          .catch(function() {
            self.alert = 'unable to configure application';
          });
    };

    this.hasConnection = function() {
      return connection.hasConnection();
    };

    this.refresh = function() {
      $route.reload();
    };
  }

  angular.module('sis.controllers')
      .controller('ConfigurationController',
      ['$route', '$location', 'authenticationToken', 'Routes',
        'connection', ConfigurationController]);
})();
