(function () {
  'use strict';

  function RiskyTimesEditController(configurationService, $modalInstance,
                                    riskyTimeToEdit, localNotifications, $window) {
    this.RISKY_TIMES_KEY = 'risky_times_key';
    this.riskyTime = {};
    this.riskyTimes = riskyTimeToEdit.currentState;
    this.riskyTimeIndex = riskyTimeToEdit.index;
    this.riskyTimeDescription = riskyTimeToEdit.description;
    this.riskyTimeTime = riskyTimeToEdit.time;
    this.riskyTimeDay = riskyTimeToEdit.day;
    this.riskyTimeStrategy = riskyTimeToEdit.strategy;
    this.riskyTimeNotificationId = riskyTimeToEdit.notificationId;

    this.updateNotification = function(riskyTime) {
      var NOTIFICATION_TEXT_MAX_SIZE = 100;
      var riskyDateTime = new Date(riskyTime.time);
      return {
        id: riskyTime.notificationId,
        title: 'Your strategy',
        text: riskyTime.strategy.substr(0, NOTIFICATION_TEXT_MAX_SIZE),
        firstAt: $window
          .moment()
          .local()
          .day(riskyTime.day)
          .hours(riskyDateTime.getHours())
          .minutes(riskyDateTime.getMinutes())
          .toDate(),
        every: 'week',
        data: { notificationId: riskyTime.notificationId }
      };
    };

    this.updateRiskyTimeStrategy = function () {
      this.riskyTimes.splice(this.riskyTimeIndex, 1);
      this.riskyTime.day = this.riskyTimeDay;
      this.riskyTime.time = this.riskyTimeTime;
      this.riskyTime.description = this.riskyTimeDescription;
      this.riskyTime.strategy = this.riskyTimeStrategy;
      this.riskyTime.notificationId = this.riskyTimeNotificationId;
      localNotifications.schedule(this.updateNotification(this.riskyTime));
      this.riskyTimes.splice(this.riskyTimeIndex, 0, this.riskyTime);
      configurationService.saveRiskyTimes(this.riskyTimes);
      $modalInstance.close();
    };

    this.cancel = function () {
      $modalInstance.close();
    };
  }

  angular.module('sis.controllers')
    .controller('RiskyTimesEditController',
    ['configurationService',
     '$modalInstance',
     'riskyTime',
     'localNotifications',
     '$window',
     RiskyTimesEditController]);
})();
