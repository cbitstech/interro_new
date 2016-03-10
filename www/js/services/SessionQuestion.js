(function() {
  'use strict';

  function SessionQuestion($filter, $http) {


    this.rawContent = null;
    this.currentSessionNumber = null;
    this.content = null;
    this.showConclusion = false;
    this.currentIndex = 0;
    this.startPosition = null;
    this.endPosition = null;

    var self = this;

    // {
    //   "order":3,
    //   "variable":"session1_1",
    //   "form":"session_1",
    //   "section":"Smoking Cessation Session #1",
    //   "type":"radio",
    //   "label":"<h3>Welcome to Interro.</h3><h4>Ready to answer a few questions?</h4>",
    //   "choices":"Totally! | No Way!",
    //   "field":"",
    //   "validation":"",
    //   "min":"",
    //   "max":"",
    //   "identifier":"",
    //   "branching_logic":"",
    //   "required":"y",
    //   "alignment":"",
    //   "question_number":"",
    //   "matrix_group":"",
    //   "matrix_ranking":""
    // }

    this.setSessionContent = function(sessionNumber) {
      this.currentSessionNumber = sessionNumber;
      $http.post(this.SESSION_CONTENT_PATH).success(this.populateContentForSession);
    };

    this.populateContentForSession = function(data) {
      var sessionFormKey = 'session_' + self.currentSessionNumber;
      self.rawContent = $filter('filter')(data.sessionContent,
        {form: sessionFormKey});
      if(self.rawContent) {
        self.content = self.parseRedCap(self.rawContent);
      }
    };

    this.setSubsessionContent = function(startPosition, endPosition) {
      self.startPosition = startPosition;
      self.endPosition = endPosition;
      $http
        .get(this.SESSION_CONTENT_PATH)
        .success(this.populateContentForSubSession)
        .error(this.onNoConnectionError);
    };

    this.onNoConnectionError = function(){

      var connectionAttemptDateTime = new Date();

      if (localStorage['REDCAP_CONTENT'] != undefined){
          this.populateContentForSubSession(JSON.parse(localStorage['REDCAP_CONTENT']))
      } else {
        alert('Please start this application for the first time where there is connectivity!');
        if(localStorage['REDCAP_CONNECTIVITY_LOG'] != undefined){
          localStorage['REDCAP_CONNECTIVITY_LOG'] = 
            JSON
            .stringify(JSON.parse(localStorage['REDCAP_CONNECTIVITY_LOG'])
            .push(connectionAttemptDateTime));
        } else {
          localStorage['REDCAP_CONNECTIVITY_LOG'] = JSON.stringify([connectionAttemptDateTime]);
        }

      }

    }

    this.populateContentForSubSession = function(data) {
      var startIndex = null;
      var endIndex = null;

      localStorage['REDCAP_CONTENT'] = JSON.stringify(data);

      for(var i=0; i < data.sessionContent.length; i++) {
        if(data.sessionContent[i].variable == self.startPosition) {
          startIndex = i;
        } else if(data.sessionContent[i].variable == self.endPosition) {
          endIndex = i + 1;
        }
      }

      self.rawContent = data.sessionContent.slice(startIndex, endIndex);

      if(self.rawContent &&
        self.rawContent[0] &&
        self.rawContent[0].order <= self.rawContent[self.rawContent.length - 1].order) {
        self.rawContent[0].branching_logic = '';
        self.content = self.parseRedCap(self.rawContent);
      } else {
        self.content = null;
      }
    };

    this.getCurrentSessionContent = function() {
      return this.content;
    };

    this.splitChoices = function(rawContent){
      angular.forEach(rawContent, function(value, key) {
        if(rawContent[key].choices && rawContent[key].choices.split) {
          rawContent[key].choices = rawContent[key].choices.split(' | ');
        }
      });
      return rawContent;
    };

    this.cleanBranchingLogic = function(branchingLogic){
      var formattedBranchingLogic = null;
      if (branchingLogic) {
        formattedBranchingLogic =
          branchingLogic.replace(/\[/g, '|')
                        .replace(/\]/g, '|')
                        .replace(/ = /g, '==|')
                        .replace(/ or /g, '|or')
                        .replace(/ and /g, '|and')
                        .split('|')
                        .splice(1);
      }
      return formattedBranchingLogic
    };

    this.parseItemLogic = function(branchingLogicArray){
      var logicToEvaluate = '';
      var checkboxOrRadio = '';
      var checkboxValue = '';

      if (branchingLogicArray && branchingLogicArray.length > 0){
        angular.forEach(branchingLogicArray, function(value2, key2){
          if (key2 % 4 === 0){
            if (value2.indexOf('(') === -1){
              checkboxOrRadio = 'radio';
            } else {
              checkboxOrRadio = 'checkbox';
              checkboxValue = value2.split('(')[1].split(')')[0];
            }
            /*eslint-disable */
            logicToEvaluate += "this.responses['" + value2.split('(')[0] + "']";
            /*eslint-enable */
          } else if (key2 % 4 === 2){
            //second variable
            switch (checkboxOrRadio){
              case 'radio':
                logicToEvaluate += '.indexOf(' + value2 + ') != -1';
                break;
              case 'checkbox':
                logicToEvaluate += '.indexOf(' + checkboxValue + ') != -1';
                break;
            }
          } else if (key2 % 4 === 3){
            //comparator
            if (value2 === 'or'){
              logicToEvaluate += ' || ';
            } else if (value2 === 'and'){
              logicToEvaluate += ' && ';

            }
          }
        });
      }
      return logicToEvaluate;
    };

    this.parseLogic = function (rawContent){
      /*eslint-disable */
      angular.forEach(rawContent, function(value, key) {
        rawContent[key].branching_logic =
          self.cleanBranchingLogic(rawContent[key].branching_logic);
        rawContent[key].evaluatedLogic =
          self.parseItemLogic(rawContent[key].branching_logic);
      });
      /*eslint-enable*/

      return rawContent;
    };

    this.parseRedCap = function(rawContent){
      /*eslint-disable */
      angular.forEach(rawContent, function(value, key){
        self.responses[value.variable] = self.responses[value.variable] || [];
      });
      /*eslint-enable */
      return self.parseLogic(self.splitChoices(rawContent));
    };

    this.evaluateLogic = function(branchingLogic){
      return eval(branchingLogic);
    };

    /*eslint-disable */
    this.questionVisible = function(branchingLogic, evaluatedLogic, index){
      return (
              // TODO Remove the following three lines when session content is complete
              this.currentSessionNumber === 1 ||
              this.currentSessionNumber === 2 ||
              this.currentSessionNumber === 3 ||
              this.currentSessionNumber == null ||
              // TODO Remove up to this point.

              branchingLogic.length === 0 ||
              self.evaluateLogic(evaluatedLogic)) &&
              self.currentIndex === index;
    };
    /*eslint-enable */


    this.next = function(){
      var selected = [];

      angular.forEach('input[name="' + self.content[this.currentIndex].variable + '"]:checked',
        function(element) {
          selected.push(element.value);
      });

      self.responses[self.content[self.currentIndex].variable] = selected;
      self.currentIndex++;

      if (self.currentIndex === self.rawContent.length){
        self.showConclusion = true;
      }
      else if (!self.questionVisible(self.rawContent[self.currentIndex].branching_logic,
                                     self.rawContent[self.currentIndex].evaluatedLogic,
                                     self.currentIndex)){
        self.showConclusion = false;
        self.next();
      }
    };

    this.resetSessionQuestions = function() {
      this.rawContent = null;
      this.currentSessionNumber = null;
      this.content = null;
      this.showConclusion = false;
      this.currentIndex = 0;
      this.responses = {};
    };

    this.responses = {};
  }

  function SessionQuestionFactory($filter, $http) {
    return new SessionQuestion($filter, $http);
  }

  angular.module('sis.services')
    .factory('sessionQuestionService',
    [ '$filter',
      '$http',
      SessionQuestionFactory]);
})();
