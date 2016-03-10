(function () {
  'use strict';

  function Ema(emaCache, emaAnswerService, uuid) {
    this.MORNING_TYPE = 'morning';
    this.EVENING_TYPE = 'evening';

    this.EMA_MORNING_START_HOUR = 9;
    this.EMA_EVENING_START_HOUR = 19;

    this.saveEma = function (emaQuestions, emaPeriod) {
      var ema = {};
      ema.id = uuid();
      ema.assessmentType = emaPeriod;
      ema.assessmentDate = moment().local().toJSON();
      ema.type = emaCache.KEY;
      emaCache.persist(ema);
      emaAnswerService.saveEmaAnswers(emaQuestions, ema.id);
    };

    this.saveEveningEma = function (ema) {
      this.saveEma(ema, this.EVENING_TYPE);
    };

    this.saveMorningEma = function (ema) {
      this.saveEma(ema, this.MORNING_TYPE);
    };

    this.getTodaysMorningEma = function() {
      var emaData = emaCache.fetchAllRaw();
      var todaysMorningEma = null;
      for (var i = 0; emaData && i < emaData.length; i++) {
        if (moment(emaData[i].assessmentDate) >= moment()
              .hours(this.EMA_MORNING_START_HOUR).minutes(0).seconds(0) &&
            moment(emaData[i].assessmentDate) < moment()
              .hours(this.EMA_EVENING_START_HOUR).minutes(0).seconds(0)) {
          todaysMorningEma = emaData[i];
          break;
        }
      }
      return todaysMorningEma;
    };

    this.getTodaysEveningEma = function() {
      var emaData = emaCache.fetchAllRaw();
      var todaysEveningEma = null;
      for (var i = 0; emaData && i < emaData.length; i++) {
        if (moment(emaData[i].assessmentDate).local() > moment().subtract(1, 'day')
            .hours(this.EMA_EVENING_START_HOUR).startOf('hour') &&
          moment(emaData[i].assessmentDate).local() < moment()
            .hours(this.EMA_MORNING_START_HOUR).startOf('hour')) {
          todaysEveningEma = emaData[i];
          break;
        }
      }
      return todaysEveningEma;
    };

    this.isMorningPeriod = function(date) {
      return date.hours() >= this.EMA_MORNING_START_HOUR &&
             date.hours() < this.EMA_EVENING_START_HOUR;
    };

    this.isEveningPeriod = function(date) {
      return date.hours() >= this.EMA_EVENING_START_HOUR ||
             date.hours() < this.EMA_MORNING_START_HOUR;
    };
  }

  function EmaFactory(emaCache, emaAnswerService, uuid) {
    return new Ema(emaCache, emaAnswerService, uuid);
  }

  angular.module('sis.services')
    .factory('emaService',
    ['emaCache', 'emaAnswerService', 'uuid', EmaFactory]);
})();
