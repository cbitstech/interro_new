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

    this.containsEndSessionIntegration = function() {
      var endSessionQuestion = this.currentQuestion &&
        this.currentQuestion.indexOf('[INTEGRATION|END_SESSION') > -1;
      var endSessionAnswer = this.currentAnswer &&
        this.currentAnswer.indexOf('[INTEGRATION|END_SESSION') > -1;
      var endPoint = null;

      if(endSessionAnswer || endSessionQuestion) {
        if(this.currentQuestion.indexOf('HOME') > -1 ||
           this.currentAnswer.indexOf('HOME') > -1) {
          endPoint = Routes.HOME;
        } else if(this.currentQuestion.indexOf('RESTART') > -1 ||
                  this.currentAnswer.indexOf('RESTART') > -1) {
          endPoint = Routes.SESSIONS;
        }
      }

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

      transformedContent = transformedContent.replace('[DISPLAY_LABEL_INTEGRATION|DATE]',
                                      this.formattedCessationDate());

      transformedContent = transformedContent.replace('[DISPLAY_LABEL_INTEGRATION|CHECKIN]',
        this.checkInAgainHashMap[this.findAnswer('Glad to hear it!' +
          ' When should we check in with you?')]);

      transformedContent = transformedContent.replace('[DISPLAY_LABEL_INTEGRATION|SOCIAL]',
                                                      this.formattedSocialSupportList());

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

    this.formattedSocialSupportList = function() {
      var formattedSocialSupportList = '';
      var socialSupports = configurationService.getSocialSupport();
      for(var i = 0; socialSupports && i < socialSupports.length; i++) {
        if(socialSupports.length > 1 && i == socialSupports.length - 1) {
          formattedSocialSupportList += ' and ';
        }
        formattedSocialSupportList += socialSupports[i].name;
        if(i < socialSupports.length - 1 && socialSupports.length > 2) {
          formattedSocialSupportList += ', ';
        }
      }
      return formattedSocialSupportList;
    };

    this.disableNext = function(choices, label) {
      return (choices.length > 0 &&
             !this.currentAnswer) ||
             (label.indexOf('[INTEGRATION') > -1 &&
             this.configurationLock);
    };

    this.containsSocialSupportIntegration = function(label) {
      return label.indexOf('[INTEGRATION|SOCIAL]') > -1;
    };

    this.containsCessationDateIntegration = function(label) {
      return label.indexOf('[INTEGRATION|DATE]') > -1;
    };

    this.containsCessationReasonsIntegration = function(label) {
      return label.indexOf('[INTEGRATION|REASONS]') > -1;
    };

    this.containsRiskyTimesIntegration = function(label) {
      return label.indexOf('[INTEGRATION|RISKY]') > -1;
    };

    this.openSocialSupportModal = function() {
      this.configurationLock = false;
      configurationModalService.openSocialSupportModal($modal);
    };

    this.openRiskyTimesModal = function () {
      this.configurationLock = false;
      configurationModalService.openRiskyTimesModal($modal);
    };

    this.openCessationReasonsModal = function () {
      this.configurationLock = false;
      configurationModalService.openCessationReasonsModal($modal);
    };

    this.triggerChoiceModal = function(choice) {
      if(this.containsCessationDateIntegration(choice)) {
        angular.element('#cessation_date_input').triggerHandler('click');
      } else if(this.containsCessationReasonsIntegration(choice)) {
        this.openCessationReasonsModal();
      } else if(this.containsRiskyTimesIntegration(choice)) {
        this.openRiskyTimesModal();
      } else if(this.containsSocialSupportIntegration(choice)) {
        this.openSocialSupportModal();
      } 
    };

    this.stripIntegrationPoints = function(dirtyValue) {
      return dirtyValue.replace(/\[INTEGRATION.*]/, '');
    };

    this.setCessationDate = function () {
      this.configurationLock = false;
      configurationService.saveCessationDate(this.cessationDate);
    };

    this.getCessationDate = function () {
      return configurationService.getCessationDate();
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
