(function () {
  'use strict';

  function EngineSelectorController($http, $location, $routeParams, Routes) {

    var self = this;

    this.PROMISMeasures = [
      {name:'promis_depression', guid:'promis_bank_v10_depression'},
      {name:'promis_anxiety', guid:'promis_bank_v10_depression'}
      ];

    this.instance = JSON.parse(localStorage['REDCAT_INSTANCE']);
    this.currentInstruments = [];
    this.uniqueInstruments = [];
 
    // this.showStartButton = false;

    this.index = $routeParams.id | 0;

    this.startAssessment = function(index){
        // determine if each measure is a CAT or not
        var engineSelect = 
          (_.some(this.PROMISMeasures,
          {name: this.uniqueInstruments[this.index]})) ? 
        Routes.PROMIS : Routes.SESSIONS;
       
        $location.url(engineSelect + '/' + index); 

    }
    
    // retrieve all defined measures
    this.getCurrentSessionContent = function(){
      $.ajax({
            url: this.instance.redcat_endpoint, 
            cache: false, 
            type: 'POST',
            data: 'token=' + 
                this.instance.redcat_token + '&content=metadata&format=json&returnFormat=json',
            dataType: 'json', 
            success: function(data) {
                self.currentInstruments = data;
                self.uniqueInstruments = _.values(_.mapValues(
                  _.uniqBy(data,'form_name'),'form_name'));
                localStorage.currentInstruments = JSON.stringify(data);
                localStorage.uniqueInstruments = JSON.stringify(self.uniqueInstruments);
                self.showStartButton = true;
            }, 
            error: function(jqXHR, textStatus, errorThrown)
            { 
                self.currentInstruments = JSON.parse(localStorage.currentInstruments);
                self.uniqueInstruments = _.values(_.mapValues(
                    _.uniqBy(self.currentInstruments,'form_name'),'form_name'));
                self.showStartButton = true;
            }
      })
    };

  }

  angular.module('sis.controllers')
    .controller('EngineSelectorController',
    [ '$http','$location', '$routeParams', 'Routes', EngineSelectorController ]);
})();
