(function() {
  'use strict';

  function EmaController(emaService,
                         sessionsService,
                         emaQuestionStates,
                         $routeParams,
                         $location,
                         Routes) {
    this.MORNING_PERIOD = 'morning';
    this.EVENING_PERIOD = 'evening';

    this.currentQuestion = emaService.isMorningPeriod(moment()) ?
      emaQuestionStates.STATE_TIME_AWAKE : emaQuestionStates.STATE_AMOUNT;
    this.currentQuestionText = null;
    this.currentAnswer = null;
    this.emaQuestions = [];
    this.questions = emaQuestionStates;
    this.emaPeriod = emaService.isMorningPeriod(moment()) ?
      this.MORNING_PERIOD : this.EVENING_PERIOD;
    this.nextQuestion = null;
    this.notificationId = $routeParams.notificationId;

    this.setState = function(state) {
      this.currentQuestion = state;
    };

    this.saveEma = function() {
      if(this.emaPeriod === this.MORNING_PERIOD) {
        emaService.saveMorningEma(this.emaQuestions);
      } else {
        emaService.saveEveningEma(this.emaQuestions);
      }
    };

    this.saveQuestionAnswer = function(question, nextQuestion) {
      this.currentQuestionText = question;
      this.nextQuestion = nextQuestion;
    };

    this.next = function() {
      this.emaQuestions.push({
        question: this.currentQuestionText,
        answer: this.currentAnswer
      });

      this.currentQuestion = this.nextQuestion;
      this.currentAnswer = null;
      if(this.nextQuestion === this.questions.STATE_FINAL) {
        this.saveEma();
      }
    };

    this.cessationSessionQuestionState = function(preCessationQuestionState,
                                                  postCessationQuestionState) {
      var question;
      if(sessionsService.cessationSession() === sessionsService.CESSATION_SESSION_PRE) {
        question = preCessationQuestionState;
      } else {
        question = postCessationQuestionState;
      }
      return question;
    };

    this.appendToCurrentAnswer = function(questionText, valueToAppend, nextQuestion) {
      this.saveQuestionAnswer(questionText, nextQuestion);

      if(this.currentAnswer) {
        this.currentAnswer += ', ' + valueToAppend;
      } else {
        this.currentAnswer = valueToAppend;
      }
    };

    this.singleClickSaveAnswer = function(question, answer, nextQuestion) {
      this.currentAnswer = answer;
      this.saveQuestionAnswer(question, nextQuestion);
      this.next();
    };

    this.emaComplete = function() {
      var destination = Routes.HOME;
      if(this.notificationId) {
        destination = Routes.MOTIVATION + '/notificationId/' + this.notificationId;
      }
      $location.url(destination);
    };
  }

  angular.module('sis.controllers')
    .controller('EmaController',
    ['emaService',
     'sessionsService',
     'EmaQuestionStates',
     '$routeParams',
     '$location',
     'Routes',
     EmaController]);
})();
