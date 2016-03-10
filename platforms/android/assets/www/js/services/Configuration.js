(function () {
  'use strict';

  function Configuration(localNotifications, $window,
                         cessationDateService, cessationReasonService,
                         riskyTimeService, socialSupportService, uuid) {

    this.CESSATION_DATE_TYPE = cessationDateService.TYPE;
    this.CESSATION_REASON_TYPE = cessationReasonService.TYPE;
    this.RISKY_TIME_TYPE = riskyTimeService.TYPE;
    this.SOCIAL_SUPPORT_TYPE = socialSupportService.TYPE;

    // Configuration localStorage KEYS
    this.MORNING_NOTIFICATION_ID = 1;
    this.MORNING_NOTIFICATION_HOUR = 9;

    this.EVENING_NOTIFICATION_ID = 2;
    this.EVENING_NOTIFICATION_HOUR = 19;

    this.getCessationDate = function () {
      return cessationDateService.getCessationDate() || null;
    };

    this.getCessationReasons = function () {
      return cessationReasonService.getCessationReasons() || [];
    };

    this.getRiskyTimes = function () {
      return riskyTimeService.getRiskyTimes() || [];
    };
    
    this.getSocialSupport = function () {
      return socialSupportService.getSocialSupports() || [];
    };

    this.getRiskyTimesByNotificationId = function (notificationId) {
      var riskyTimes = this.getRiskyTimes();
      var riskyTimeToReturn = null;

      riskyTimes.forEach(function(riskyTime) {
        if(notificationId === riskyTime.notificationId) {
          riskyTimeToReturn = riskyTime;
        }
      });
      return riskyTimeToReturn;
    };

    this.scheduleNotifications = function() {
      if(this.configurationComplete()) {
        localNotifications.schedule([this.generateMorningNotification(),
          this.generateEveningNotification()]);
      }
    };

    this.saveCessationDate = function (date) {
      date.id = uuid();
      cessationDateService.save(date);
      this.scheduleNotifications();
    };

    this.saveCessationReasons = function (cessationReasons) {
      cessationReasonService.save(cessationReasons);
      this.scheduleNotifications();
    };

    this.saveRiskyTimes = function (riskyTimes) {
      riskyTimeService.save(riskyTimes);
      this.scheduleNotifications();
    };

    this.saveSocialSupport = function (socialSupport) {
      socialSupportService.save(socialSupport);
      this.scheduleNotifications();
    }

    this.generateMorningNotification = function() {
      return {
        id: this.MORNING_NOTIFICATION_ID,
        title: 'SiS: Good Morning!',
        text: 'It\'s time to enter some information for the smoking study.',
        firstAt: $window
                 .moment()
                 .local()
                 .hours(this.MORNING_NOTIFICATION_HOUR)
                 .minutes(0)
                 .seconds(0)
                 .toDate(),
        every: 'day'
      };
    };

    this.generateEveningNotification = function() {
      return {
        id: this.EVENING_NOTIFICATION_ID,
        title: 'SiS: Good Evening!',
        text: 'It\'s time to enter some information for the smoking study.',
        firstAt: $window
                 .moment()
                 .local()
                 .hours(this.EVENING_NOTIFICATION_HOUR)
                 .minutes(0)
                 .seconds(0)
                 .toDate(),
        every: 'day'
      };
    };

    this.configurationComplete = function () {
      return this.getCessationDate() &&
             this.getCessationReasons().length > 0 &&
             this.getRiskyTimes().length > 0 &&
             this.getSocialSupport().length > 0;
    };

    this.deleteCessationReason = function (cessationReasonId) {
      cessationReasonService.delete(cessationReasonId);
    };

    this.deleteRiskyTime = function (riskyTimeId) {
      riskyTimeService.delete(riskyTimeId);
    };

    this.deleteSocialSupport = function (socialSupportId) {
      socialSupportService.delete(socialSupportId);
    };
  }

  function ConfigurationFactory(configurationCache, localNotifications,
                                $window, cessationDateService, cessationReasonService,
                                riskyTimeService, socialSupportService, uuid) {
    return new Configuration(configurationCache, localNotifications,
                             $window, cessationDateService, cessationReasonService,
                             riskyTimeService, socialSupportService, uuid);
  }

  angular.module('sis.services')
    .factory('configurationService',
    ['localNotifications',
     '$window',
     'cessationDateService',
     'cessationReasonService',
     'riskyTimeService',
     'socialSupportService',
     'uuid',
     ConfigurationFactory]);
})();
