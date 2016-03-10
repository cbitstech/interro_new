(function () {
  'use strict';

  function HomeController(sessionsService, exerciseService,
                          exerciseAnswerService, smokingStatusService) {

    this.CESSATION_DATE_KEY = 'cessation_date';
    this.CESSATION_SESSION_POST_DAY_OFFSET = sessionsService.CESSATION_SESSION_POST_DAY_OFFSET;
    this.CESSATION_SESSION_POST_DAY_OFFSET_PLURAL =
      sessionsService.CESSATION_SESSION_POST_DAY_OFFSET_PLURAL;
    this.CESSATION_SESSION_POST_DAY_OFFSET_SINGULAR =
      sessionsService.CESSATION_SESSION_POST_DAY_OFFSET_SINGULAR;

    this.CESSATION_SESSION_PRE = sessionsService.CESSATION_SESSION_PRE;
    this.CESSATION_SESSION_DURING = sessionsService.CESSATION_SESSION_DURING;
    this.CESSATION_SESSION_POST = sessionsService.CESSATION_SESSION_POST;

    this.SESSION_ID_1 = 1;
    this.SESSION_ID_2 = 2;
    this.SESSION_ID_3 = 3;

    this.todaysExercise = exerciseService.getTodaysExercise();
    this.smokingStatus = smokingStatusService.getSmokingStatus();
    this.todaysExerciseAnswers = exerciseAnswerService.
      getExerciseAnswers(this.todaysExercise.id);

    this.cessationSessionValue = undefined;
    this.cessationDayOffsetValue = undefined;
    this.cessationDayOffsetAbsValue = undefined;

    this.cessationDayOffset = function () {
      this.cessationDayOffsetValue = sessionsService.cessationDayOffset();
      return this.cessationDayOffsetValue;
    };

    this.cessationDayOffsetAbs = function () {
      this.cessationDayOffsetAbsValue = sessionsService.cessationDayOffsetAbs();
      return this.cessationDayOffsetAbsValue;
    };

    this.cessationSession = function (offset) {
      this.cessationSessionValue = sessionsService.cessationSession(offset);
      return this.cessationSessionValue;
    };

    this.getCurrentSession = function () {
      return this.cessationSession(this.cessationDayOffset());
    };

    this.isSessionComplete = function(sessionId) {
      return sessionsService.isComplete(sessionId);
    };
  }

  angular.module('sis.controllers')
    .controller('HomeController',
    [ 'sessionsService',
      'exerciseService',
      'exerciseAnswerService',
      'smokingStatusService',
      HomeController]);
})();
