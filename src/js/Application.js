/* Declare app level module which depends on filters, and services */
(function() {
  'use strict';

  var Application = {
    self: this,

    configure: function configure($routeProvider, Routes) {
      $routeProvider
        .when(Routes.ROOT, {
          templateUrl: 'partials/redcat_initializer.html',
          controller: 'RedCatInitializerController',
          controllerAs: 'redcat'
        })
        .when(Routes.REDCAT, {
          templateUrl: 'partials/redcat_initializer.html',
          controller: 'RedCatInitializerController',
          controllerAs: 'redcat'
        })
        .when(Routes.CONFIG, {
          templateUrl: 'partials/configure.html',
          controller: 'ConfigurationController',
          controllerAs: 'config'
        })
        .when(Routes.HOME, {
          templateUrl: 'partials/home.html',
          controller: 'HomeController',
          controllerAs: 'home'
        }).when(Routes.SESSION_SUB_NAV, {
          templateUrl: 'partials/session_sub_nav.html',
          controller: 'SessionSubNavController',
          controllerAs: 'subSession'
        })
        .when(Routes.DECISION_SUPPORT, {
          templateUrl: 'partials/decision_support.html',
          controller: 'DecisionSupportController',
          controllerAs: 'setup'
        })
        .when(Routes.GRAPHS, {
          templateUrl: 'partials/graphs.html',
          controller: 'GraphController',
          controllerAs: 'graphs'
        })
        .when(Routes.SET_UP, {
          templateUrl: 'partials/set_up.html',
          controller: 'SetUpController',
          controllerAs: 'setup'
        })
        .when(Routes.ENGINE_SELECTOR, {
          templateUrl: 'partials/engine_selector.html',
          controller: 'EngineSelectorController',
          controllerAs: 'engine'
        })
        .when(Routes.PROMIS + '/:index', {
          templateUrl: 'partials/promis.html',
          controller: 'PROMISController',  
        })
        .when(Routes.SESSIONS + '/:index', {
          templateUrl: 'partials/session.html',
          controller: 'SessionsController',
          controllerAs: 'session'
        });;
    },

    run: function run($rootScope, $location, $q, $window, settings,
                      authenticationTokenCache, Routes, synchronizer,
                      deviceCache, device, configurationService,
                      emaService, eventService, sessionQuestionService,
                      sessionsService, configurationCache,
                      emaCache, exerciseCache, resourceCache, sessionsCache,
                      settingsCache, emaAnswerCache, exerciseAnswerCache,
                      sessionAnswerCache) {


      settings.fetch().then(function() {

        // $rootScope.$on('resume', function() {
        //   if (localStorage['REDCAT_INSTANCE'] != undefined){
        //     $location.url(Routes.REDCAT)
        //   }
        //   else{
        //     $location.url(Routes.SESSIONS)
        //   }
        // });
      });
      
      device.persistMetadata();

      angular.forEach([deviceCache, configurationCache,
                       emaCache, exerciseCache, resourceCache, sessionsCache,
                       settingsCache, emaAnswerCache, exerciseAnswerCache,
                       sessionAnswerCache], function(cache) {
        synchronizer.registerCache(cache);
      });
      synchronizer.run();

      document.addEventListener('backbutton', eventService.handleBackButton, false);
    }
  };

  angular.module('sis.constants', []);
  angular.module('sis.resources',
      ['ngResource', 'sis.services', 'sis.constants']);
  angular.module('sis.controllers',
      ['sis.constants', 'sis.resources', 'sis.services', 'ui.bootstrap']);
  angular.module('sis.services',
      ['sis.resources', 'sis.constants']);
  angular.module('sis',
      ['ngRoute', 'mobiscroll-datetime', 'sis.controllers',
        'sis.resources', 'sis.services', 'sis.constants'])
      .config(['$routeProvider', 'Routes', Application.configure])
      .run(['$rootScope', '$location', '$q', '$window', 'settings', 'authenticationTokenCache',
        'Routes', 'synchronizer', 'deviceCache', 'device', 'configurationService', 'emaService',
        'eventService', 'sessionQuestionService', 'sessionsService', 
        'configurationCache', 'emaCache', 'exerciseCache', 'resourceCache', 'sessionsCache',
        'settingsCache', 'emaAnswerCache',
        'exerciseAnswerCache', 'sessionAnswerCache', Application.run]);
})();
