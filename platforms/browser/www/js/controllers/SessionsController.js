(function() {
  'use strict';

  function SessionsController(sessionsService, sessionQuestionService,
                              sessionAnswerService, $sce, configurationModalService,
                              $modal, configurationService, uuid, $filter, Routes,
                              $location, $routeParams) {
    this.currentAnswer = null;
    this.currentQuestion = null;
    this.sessionAnswers = null;
    this.sessionContent = null;
    this.cessationDate = null;
    this.currentNotes = null;
    this.configurationLock = true;
    this.startPosition = $routeParams.start;
    this.endPosition = $routeParams.end;
    this.currentSessionComplete = null;

    this.formName = $routeParams.formName;
    this.nextAssessment = $routeParams.nextAssessment;

    this.containsEndSessionIntegration = function() {
      var endPoint = null;
      return endPoint;
    };

    this.makeSelection = function (questionDescription, answer) {
      this.currentAnswer = answer;
      this.currentQuestion = questionDescription;
      this.triggerChoiceModal(answer);
    };

    this.setCurrentSessionContent = function () {
      sessionQuestionService.resetSessionQuestions();
      if(this.startPosition && this.endPosition){
        sessionQuestionService.setSubsessionContent(this.startPosition, this.endPosition);
      } else {
        sessionQuestionService.setSessionContent(sessionsService.currentSessionNumber());
      }
    };

    this.saveSessionAnswer = function() {
      this.sessionAnswers.push({
        question: this.currentQuestion,
        answer: this.currentAnswer || this.currentNotes
      });
      this.currentAnswer = null;
      this.currentNotes = null;
    };

    this.findAnswer = function(questionLabel){
      var answer = '';
      var answerLocation = $filter('filter')(this.sessionAnswers,
        {question:questionLabel}) || [];
      if (answerLocation.length > 0){ answer = answerLocation[0].answer}
      return answer
    }

    this.questionVisible = function(branchingLogic, evaluatedLogic, index){
      return sessionQuestionService.questionVisible(branchingLogic, evaluatedLogic, index);
    };

    this.startSession = function () {
      this.sessionAnswers = [];
    };

    this.getSessionStarted = function() {
      return this.sessionAnswers;
    };

    this.getSessionContent = function() {
      return sessionQuestionService.getCurrentSessionContent();
    };

    this.persistSession = function() {
      var session = {};
      session.sessionDate = moment().toISOString();
      session.id = uuid();
      session.sessionType = sessionsService.SESSION_KEY_PREFIX +
        sessionsService.currentSessionNumber();
      sessionsService.saveSession(session);
      sessionAnswerService.save(this.sessionAnswers, session.id);
    };

    this.next = function() {
      var endSessionLocation = this.containsEndSessionIntegration();
      this.configurationLock = true;
      this.saveSessionAnswer();
      sessionQuestionService.next();

      if(sessionQuestionService.showConclusion) {
        this.persistSession();
        this.currentSessionComplete = true;
      } else if(endSessionLocation) {
        this.persistSession();
        this.setCurrentSessionContent();
        $location.url(endSessionLocation);
      }
    };

    this.showConclusion = function() {
      return sessionQuestionService.showConclusion;
    };

    this.convertHtmlContent = function(rawContent) {
      var contentWithIntegrationDisplay = this.transformedIntegrationDisplay(rawContent);
      return $sce.trustAsHtml(contentWithIntegrationDisplay.replace(/\[INTEGRATION.*]/, ''));
    };

    this.transformedIntegrationDisplay = function(rawContent) {
      var transformedContent = rawContent;

      return transformedContent
    };

    this.checkInAgainHashMap = {
      '1, in 1 week': ' in 1 week ',
      '2, in 1 month': ' in 1 month ',
      '3, in 6 months': ' in 6 months ' 
    }

    this.formattedCessationDate = function() {
      var cessationDate = new Date(configurationService.getCessationDate());
      return $filter('date')(cessationDate, 'EEEE, MMM. d');
    };


    this.disableNext = function(choices, label) {
      return (choices.length > 0 &&
             !this.currentAnswer) ||
             (label.indexOf('[INTEGRATION') > -1 &&
             this.configurationLock);
    };

    this.stripIntegrationPoints = function(dirtyValue) {
      return dirtyValue.replace(/\[INTEGRATION.*]/, '');
    };

  }

  angular.module('sis.controllers')
    .controller('SessionsController',
    ['sessionsService',
     'sessionQuestionService',
     'sessionAnswerService',
     '$sce',
     'configurationModalService',
     '$modal',
     'configurationService',
     'uuid',
     '$filter',
     'Routes',
     '$location',
     '$routeParams',
     SessionsController]);
})();
