/* Declare app level module which depends on filters, and services */
(function() {
  'use strict';

  var Application = {
    self: this,

    configure: function configure($routeProvider, Routes) {
      $routeProvider
        .when(Routes.ROOT, {
          templateUrl: 'partials/set_up.html',
          controller: 'SetUpController',
          controllerAs: 'setup'
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
        .when(Routes.SET_UP, {
          templateUrl: 'partials/set_up.html',
          controller: 'SetUpController',
          controllerAs: 'setup'
        })
        .when(Routes.EXERCISE, {
          templateUrl: 'partials/exercise.html',
          controller: 'ExerciseController',
          controllerAs: 'exercise'
        })
        .when(Routes.TEMPTATION_LOG, {
          templateUrl: 'partials/temptation_log.html',
          controller: 'TemptationLogController',
          controllerAs: 'temptation'
        })
        .when(Routes.SMOKING_STATUS, {
          templateUrl: 'partials/smoking_status.html',
          controller: 'SmokingStatusController',
          controllerAs: 'smoking'
        })
        .when(Routes.CIGARETTE_LOG, {
          templateUrl: 'partials/cigarette_log.html',
          controller: 'CigaretteLogController',
          controllerAs: 'cigarette'
        })
        .when(Routes.SESSIONS, {
          templateUrl: 'partials/session.html',
          controller: 'SessionsController',
          controllerAs: 'session'
        })
        .when(Routes.MORNING_EMA, {
          templateUrl: 'partials/morning.html',
          controller: 'EmaController',
          controllerAs: 'ema'
        })
        .when(Routes.EVENING_EMA, {
          templateUrl: 'partials/evening.html',
          controller: 'EmaController',
          controllerAs: 'ema'
        })
        .when(Routes.MOTIVATION + '/notificationId/:notificationId', {
          templateUrl: 'partials/motivation.html',
          controller: 'MotivationController',
          controllerAs: 'motivation',
          resolve: { notification: function() {
            self.fromNotification = true;
            return true;
          }}
        });
    },

    run: function run($rootScope, $location, $q, $window, settings,
                      authenticationTokenCache, Routes, synchronizer,
                      deviceCache, device, configurationService,
                      emaService, eventService, sessionQuestionService,
                      sessionsService, cigaretteLogCache, configurationCache,
                      emaCache, exerciseCache, resourceCache, sessionsCache,
                      settingsCache, smokingStatusCache, temptationLogCache,
                      cessationReasonCache, cessationDateCache, riskyTimeCache,
                      socialSupportCache, emaAnswerCache, exerciseAnswerCache,
                      sessionAnswerCache) {

      function configurationIncompleteRouting() {
        var currentSessionNumber = sessionsService.currentSessionNumber();
        if(!configurationService.getCessationDate() ||
          (currentSessionNumber === 1 &&
          !sessionsService.isComplete(currentSessionNumber))) {
          $location.url(Routes.SESSIONS)
        } else {
          $location.url(Routes.SET_UP);
        }
      }

      function determineRouteFromState() {
        if (configurationService.configurationComplete()) {
          if (emaService.isMorningPeriod(moment()) && !emaService.getTodaysMorningEma()) {
            $location.url(Routes.MORNING_EMA + motivationPostfix());
          } else if (emaService.isEveningPeriod(moment()) && !emaService.getTodaysEveningEma()) {
            $location.url(Routes.EVENING_EMA + motivationPostfix());
          } else if(self.fromNotification) {
            self.fromNotification = false;
          } else {
            $location.url(Routes.HOME);
          }
        } else {
          configurationIncompleteRouting();
        }
      }

      function motivationPostfix() {
        var NOTIVATION_ID_INDEX = 3;
        var motivationSegments = $location.url()
          .indexOf('motivation') > -1 ? $location.url().split('/') : [];
        var postfix = '';
        if (motivationSegments.length > 0) {
          postfix = '?notificationId=' + motivationSegments[NOTIVATION_ID_INDEX];
        }
        return postfix;
      }

      settings.fetch().then(function() {
        determineRouteFromState();
        $rootScope.$on('resume', function() {
          determineRouteFromState();
        });
      });
      
      device.persistMetadata();

      angular.forEach([deviceCache, cigaretteLogCache, configurationCache,
                       emaCache, exerciseCache, resourceCache, sessionsCache,
                       settingsCache, smokingStatusCache, temptationLogCache,
                       cessationReasonCache, cessationDateCache, riskyTimeCache,
                       socialSupportCache, emaAnswerCache, exerciseAnswerCache,
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
        'eventService', 'sessionQuestionService', 'sessionsService', 'cigaretteLogCache',
        'configurationCache', 'emaCache', 'exerciseCache', 'resourceCache', 'sessionsCache',
        'settingsCache', 'smokingStatusCache', 'temptationLogCache', 'cessationReasonCache',
        'cessationDateCache', 'riskyTimeCache', 'socialSupportCache', 'emaAnswerCache',
        'exerciseAnswerCache', 'sessionAnswerCache', Application.run]);
})();
