(function () {
  'use strict';

  function RiskyTimesController(configurationService,
                                sessionsService,
                                $modal,
                                $modalInstance,
                                localNotifications,
                                $window,
                                uuid,
                                modalParameters) {
    this.SUNDAY_KEY = 'su';
    this.MONDAY_KEY = 'm';
    this.TUESDAY_KEY = 'tu';
    this.WEDNESDAY_KEY = 'w';
    this.THURSDAY_KEY = 'th';
    this.FRIDAY_KEY = 'f';
    this.SATURDAY_KEY = 'sa';

    this.NOTIFICATION_TYPE_1 = 0;
    this.NOTIFICATION_TYPE_2 = 1;
    this.NOTIFICATION_TYPE_3 = 2;
    this.NOTIFICATION_TEXT_MAX_SIZE = 100;
    this.MAX_RANDOM_TYPE_PRE_SESSION_2 = 2;

    this.DAYS_OF_THE_WEEK = [
      this.SUNDAY_KEY,
      this.MONDAY_KEY,
      this.TUESDAY_KEY,
      this.WEDNESDAY_KEY,
      this.THURSDAY_KEY,
      this.FRIDAY_KEY,
      this.SATURDAY_KEY
    ];

    this.riskyTime = {};
    this.cessationReasons = configurationService.getCessationReasons();
    this.riskyTimes = configurationService.getRiskyTimes();

    this.saveRiskyTime = function () {
      this.riskyTime.id = uuid();
      this.riskyTime.notificationId = uuid();
      this.riskyTime.type = configurationService.RISKY_TIME_TYPE;
      this.translateDay();

      if(this.riskyTime.time) {
        localNotifications.schedule(this.generateNotification(this.riskyTime));
      }

      configurationService.saveRiskyTimes(this.riskyTime);
      this.riskyTimes = configurationService.getRiskyTimes();
      this.resetButtons();
      this.riskyTime = {};
    };

    this.randomNotification = function (riskyTime) {
      var notificationType;

      if(riskyTime.strategy) {
        notificationType = this.NOTIFICATION_TYPE_3;
      } else {
        if(this.cessationReasons) {
          notificationType = Math.floor(Math.random() * this.MAX_RANDOM_TYPE_PRE_SESSION_2);
        } else {
          notificationType = this.NOTIFICATION_TYPE_1;
        }
      }

      return this.buildNotification(notificationType, riskyTime);
    };

    this.buildNotification = function(notificationType, riskyTime) {
      var notification = {};

      switch(notificationType) {
        case this.NOTIFICATION_TYPE_1:
          notification.title = 'SiS Reminder';
          notification.text = 'Time to enact one of your smoke-free strategies';
          break;
        case this.NOTIFICATION_TYPE_2:
          var reason = this.cessationReasons[
            Math.floor(Math.random() * this.cessationReasons.length)
            ];
          if(reason) {
            notification.title = 'Why you want to be smoke-free';
            notification.text = reason.description;
          } else {
            notification.title = 'SiS Reminder';
            notification.text = 'Time to enact one of your smoke-free strategies';
          }
          break;
        case this.NOTIFICATION_TYPE_3:
          notification.title = 'Your strategy';
          notification.text = riskyTime.strategy.substr(0, this.NOTIFICATION_TEXT_MAX_SIZE);
          break;
      }

      return notification;
    };

    this.generateNotification = function(riskyTime) {
      var randomNotification = this.randomNotification(riskyTime);
      return {
        id: riskyTime.notificationId,
        title: randomNotification.title,
        text: randomNotification.text,
        firstAt: $window
          .moment()
          .local()
          .day(riskyTime.day)
          .hours(riskyTime.time.getHours())
          .minutes(riskyTime.time.getMinutes())
          .toDate(),
        every: 'week',
        data: { notificationId: riskyTime.notificationId }
      };
    };

    this.translateDay = function () {
      switch (this.riskyTime.day) {
        case this.SUNDAY_KEY:
          this.riskyTime.day = 'Sunday';
          break;
        case this.MONDAY_KEY:
          this.riskyTime.day = 'Monday';
          break;
        case this.TUESDAY_KEY:
          this.riskyTime.day = 'Tuesday';
          break;
        case this.WEDNESDAY_KEY:
          this.riskyTime.day = 'Wednesday';
          break;
        case this.THURSDAY_KEY:
          this.riskyTime.day = 'Thursday';
          break;
        case this.FRIDAY_KEY:
          this.riskyTime.day = 'Friday';
          break;
        case this.SATURDAY_KEY:
          this.riskyTime.day = 'Saturday';
          break;
      }
    };

    this.selectWeekday = function (day) {
      this.resetButtons();
      this.riskyTime.day = day;
      this.activeButton = day;
    };

    this.isSessionTwoComplete = function() {
      return sessionsService.isComplete(2);
    };

    this.deleteRiskyTime = function (riskyTimeId, notificationId) {
      localNotifications.clear(notificationId);
      configurationService.deleteRiskyTime(riskyTimeId);
      this.riskyTimes = configurationService.getRiskyTimes();
    };

    this.resetButtons = function () {
      this.activeButton = '';
    };

    this.openEditModal = function (riskyTime,
                                   riskyDay,
                                   riskyDescription,
                                   riskyStrategy,
                                   riskyIndex,
                                   riskyTimeNotificationId) {
      var self = this;
      $modal.open({
        animation: true,
        templateUrl: 'partials/risky_times_edit.html',
        controller: 'RiskyTimesEditController',
        controllerAs: 'riskyEdit',
        size: 'lg',
        resolve: {
          riskyTime: function() {
            return { time: riskyTime,
                     day: riskyDay,
                     description: riskyDescription,
                     strategy: riskyStrategy,
                     index: riskyIndex,
                     currentState: self.riskyTimes,
                     notificationId: riskyTimeNotificationId
            };
          }
        }
      });
    };

    this.cancel = function () {
      $modalInstance.close();
    };

    this.isModal = modalParameters.isModal || false;
    this.instructionContent = modalParameters.instructionContent || '';
  }

  angular.module('sis.controllers')
    .controller('RiskyTimesController',
    ['configurationService', 'sessionsService', '$modal', '$modalInstance',
     'localNotifications', '$window', 
     'uuid','modalParameters', RiskyTimesController]);
})();
