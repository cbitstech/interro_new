/* controllers.js */
// Contains the controller definitions for Urology Survey
// Tony Andrys

angular.module('sis.controllers')

.controller('PROMISController', function($scope, $http, $rootScope, $routeParams, $location, Routes) {
  console.log('CAT Controller loaded.');

	var scores = [];
	//storage.bind($rootScope, 'scores', JSON.stringify(scores));
	//storage.bind($rootScope,'TSCORE',{defaultValue:0.0,storeName: 'TSCORE'});
	//storage.bind($rootScope,'SE',{defaultValue: 0.0 ,storeName: 'SE'});

	$scope.PROMISMeasures = [
      {name:'promis_depression', guid:'promis_bank_v10_depression'},
      {name:'promis_anxiety', guid:'promis_bank_v10_depression'}
    ];

	$scope.scores = [];

	$scope.redcatInstance = JSON.parse(localStorage['REDCAT_INSTANCE']);
	$scope.assessmentIndex = $routeParams.index;
	$scope.currentInstruments = JSON.parse(localStorage.currentInstruments);
    $scope.uniqueInstruments = JSON.parse(localStorage.uniqueInstruments);
	$scope.PROMISguid = $scope.PROMISMeasures[
						_.findIndex(
							$scope.PROMISMeasures,
							{name:$scope.uniqueInstruments[$scope.assessmentIndex]})]
						.guid;
	
	$scope.QUESTIONS_URL = 'content/measures/' + $scope.PROMISguid + '.json';
	$scope.CALIBRATIONS_URL = 'content/calibrations/' + $scope.PROMISguid + '.json';
	
	$scope.surveyFinished = function(){
		if ($scope.uniqueInstruments.length > parseInt($scope.assessmentIndex+1)){
			$location.url(Routes.PROMIS + "/" + parseInt($scope.assessmentIndex + 1));
		} else {
			$location.url(Routes.HOME);
		}
		//TODO detect if the next questionnaire is or is not a PROMIS measure
	}

	$scope.loadForm = function() {
			console.log('CAT load Form.');
			$http.get($scope.QUESTIONS_URL).success(function(data) {
				$scope.items = data.Items;
				console.log('CAT Controller loading items ' +   $scope.items.length);
				
				 $http.get($scope.CALIBRATIONS_URL).success(function(data) {
					$scope.calibrations = data;
					//sequenceEngine = new engine($scope.calibrations);
					//sequenceEngine.init( );
					//$scope.renderScreen(sequenceEngine.display());
					$scope.sequenceEngine = new $scope.engine($scope.calibrations);
					$scope.sequenceEngine.init( );
					$scope.renderScreen($scope.sequenceEngine.display());
					
				});
			});
	};


	$scope.saveData = function(scoreArray,tScore,finalSE){

		var dataToTransmit = scoreArray;

		dataToTransmit['promis_tscore'] = tScore;
		dataToTransmit['record_id'] = 1;
		dataToTransmit['promis_std_error'] = finalSE;

      	$.ajax({
            url: $scope.redcatInstance.redcat_endpoint, 
            cache: false, 
            type: 'POST',
            data: 'token=' + 
                $scope.redcatInstance.redcat_token + 
                '&content=record&format=json' +
                '&returnFormat=json' +
                '&overwriteBehavior=normal'+
                '&data=' +JSON.stringify([dataToTransmit]),
            dataType: 'json', 
            success: function(data) {
            	debugger;
                
            }, 
            error: function(jqXHR, textStatus, errorThrown)
            { 
            	debugger;
                
            }
      	})
    };


	$scope.renderScreen = function(ItemID) {
	
		if($scope.sequenceEngine.finished){
			$scope.finalResults = $scope.sequenceEngine.displayResults();
			$scope.itemScores = $scope.finalResults.itemScores;
			$scope.transmissionScores = $scope.finalResults.transmissionScores;
			$scope.finalTScore = $scope.itemScores[$scope.itemScores.length-1].Theta*10+50;
			$scope.finalSE = $scope.itemScores[$scope.itemScores.length-1].SE*10;
			$scope.responses =[];
			$scope.context  = "" ;
			$scope.stem = "" ;
			$scope.saveData($scope.transmissionScores,$scope.finalTScore,$scope.finalSE);
			return;
		}
	
		for(var i=0; i < $scope.items.length; i++){
			if($scope.items[i].ID == ItemID){
					$scope.context = $scope.items[i].Elements[0].Description;
					$scope.stem = $scope.items[i].Elements[1].Description;
					$scope.responses =[];
					$scope.responses[0] = {'FormItemOID': $scope.items[i].Elements[2].Map[0].FormItemOID, 'ItemResponseOID':  $scope.items[i].Elements[2].Map[0].ItemResponseOID ,'Description':  $scope.items[i].Elements[2].Map[0].Description };
					$scope.responses[1] = {'FormItemOID': $scope.items[i].Elements[2].Map[1].FormItemOID, 'ItemResponseOID':  $scope.items[i].Elements[2].Map[1].ItemResponseOID ,'Description':  $scope.items[i].Elements[2].Map[1].Description };
					$scope.responses[2] = {'FormItemOID': $scope.items[i].Elements[2].Map[2].FormItemOID, 'ItemResponseOID':  $scope.items[i].Elements[2].Map[2].ItemResponseOID ,'Description':  $scope.items[i].Elements[2].Map[2].Description };
					$scope.responses[3] = {'FormItemOID': $scope.items[i].Elements[2].Map[3].FormItemOID, 'ItemResponseOID':  $scope.items[i].Elements[2].Map[3].ItemResponseOID ,'Description':  $scope.items[i].Elements[2].Map[3].Description };
					$scope.responses[4] = {'FormItemOID': $scope.items[i].Elements[2].Map[4].FormItemOID, 'ItemResponseOID':  $scope.items[i].Elements[2].Map[4].ItemResponseOID ,'Description':  $scope.items[i].Elements[2].Map[4].Description };

			}
		}
		
	};


	$scope.selectResponse = function(event) {

		$scope.sequenceEngine.processResponse(event.target.id,event.target.name);
		var NextItem = $scope.sequenceEngine.next();
		$scope.renderScreen( $scope.sequenceEngine.ID);
	
	};

	$scope.engine = function (_calibration){


		this.calibration = _calibration;

		this.itemstore = new Array();
		this.responses = new Array();
		this.position = 0;
		this.ability = 0.0;
		this.ability_min = -4.0;
		this.ability_max = 4.0;
		
		this.item_max = 12;
		this.item_min = 4;
		
		this.StandardError = 0.0;
		this.ID ="";

		this.Matrix = new Object();
		this.AbilityRange = new Array();
		this.LikelyHood = new Array();
		this.LikelyHoodEstimate = new Array();
		this.Calibrations = new Object();
		
		this.finished = false;
		
		this.init = function(){
		
			this.setAbilityRange();	
			this.LikelyHood = this.SetNormalDistribution(this.AbilityRange);
			this.LikelyHoodEstimate = this.SetNormalDistribution(this.AbilityRange);
			this.Calibrations = this.loadParameters(this.calibration.Items);
			this.calibrate(this.AbilityRange, this.Calibrations, this.Matrix);
			this.display();
			  console.log('CAT Controller initialized.');
		}

		this.calculateItemResponseProb = function (question,response,calibrations,abilityRange){

			var probItemResponse = new Array();


			for (var k=0; k < abilityRange.length;k++)
			{
				if( (response-1) == calibrations[question].Boundaries.length ){//boundary condition
					probItemResponse[k] =   1.0 / ( 1.0 + Math.exp( -1.0 *  calibrations[question].A_GRM * (abilityRange[k] - calibrations[question].Boundaries[calibrations[question].Calibration.length-1]) ));
				}else{
					probItemResponse[k] = 1.0 / ( 1.0 + Math.exp( -1.0 *  calibrations[question].A_GRM * (abilityRange[k] - calibrations[question].Boundaries[response-1]) ));
				}

				if( (response-1) == 0){
					probability = 1.0; 
				}else{
					probability =  1.0 / ( 1.0 + Math.exp( -1.0 *  calibrations[question].A_GRM * (abilityRange[k] - calibrations[question].Boundaries[response-2]) ));
				}
				
				if( (response-1) != calibrations[question].Boundaries.length ){
					probItemResponse[k] =  probability  -  probItemResponse[k] ;
				}
			}
			
			return probItemResponse;
		}


		this.calculateVari = function(ability, calibrations){

			var runningTotal = 0.0;
			for (var question in calibrations)
			{
			  runningTotal  = 0.0;
			  calibrations[question].Vari = 0.0 ;
			  
			  for ( var i=0; i <calibrations[question].Calibration.length + 1 ; i++){
			  var x =  calibrations[question].ThresholdSum[i] * (1- calibrations[question].ThresholdSum[i] );
			  var xi = calibrations[question].ThresholdSum[i +1] * (1- calibrations[question].ThresholdSum[i + 1] );  
				runningTotal = runningTotal + Math.pow(calibrations[question].A_GRM *(x - xi),2)/ calibrations[question].Prob[i];
			  }
			  
			  calibrations[question].Vari = runningTotal ;
			}

		}

		this.calculateProb = function(ability, calibrations){

			for (var question in calibrations)
			{
		 
			  for ( var i=0; i <calibrations[question].Calibration.length ; i++){ 

				calibrations[question].Prob[i] = 1.0 / ( 1.0 + Math.exp( -1.0 *  calibrations[question].A_GRM * (ability - calibrations[question].Boundaries[i]) ));

				if( i == 0){
					probability = 1.0; 
				}else{
					probability =  1.0 / ( 1.0 + Math.exp( -1.0 *  calibrations[question].A_GRM * (ability - calibrations[question].Boundaries[i-1]) ));
				}
				calibrations[question].Prob[i] =  probability  -  calibrations[question].Prob[i] ;
				calibrations[question].ThresholdSum[i] = probability;
			  }
			  
			  calibrations[question].Prob[calibrations[question].Calibration.length] =  1.0 / ( 1.0 + Math.exp( -1.0 *  calibrations[question].A_GRM * (ability - calibrations[question].Boundaries[calibrations[question].Calibration.length-1]) ));

			  calibrations[question].ThresholdSum[calibrations[question].Calibration.length] = calibrations[question].Prob[calibrations[question].Calibration.length];
			  calibrations[question].ThresholdSum[calibrations[question].Calibration.length + 1] = 0.0;

			}
			
		}

		this.Results = function(id, response, ability, se){
			this.ID = id;
			this.Response = response;
			this.Ability = ability;
			this.SE = se;
		}

		this.Question = function(id, difficulty){

			this.ID = id;
			this.Vari;
			this.Administered = false;

			this.Calibration = new Array();
			this.Boundaries = new Array();

			this.Prob = new Array();
			this.ThresholdSum = new Array();
		}

		this.getNextItem = function(calibrations, matrix, abilities, Likelyhood){

			var highestVariance = 0.0;
			var abilityLikelyHood = 0.0;
			var nextQuestion = "";

			var LikelyhoodWeighting = new Object();
			
			for (var question in calibrations)
			{
				LikelyhoodWeighting[question]  = 0.0;
			}

			for( var i=0; i < abilities.length; i++){
			
				var QuestionVariance = matrix[abilities[i]];

				abilityLikelyHood = Likelyhood[i];
				
				for (var question in calibrations)
				{
					LikelyhoodWeighting[question] = LikelyhoodWeighting[question] + QuestionVariance[question] * abilityLikelyHood;
				}
			}
			
			for (var question in calibrations)
			{
				if(LikelyhoodWeighting[question] > highestVariance && calibrations[question].Administered == false){
					highestVariance = LikelyhoodWeighting[question];
					nextQuestion = question;
				}
				
			}

			return nextQuestion;
		}



		this.loadParameters = function(items){

			var Calibrations = new Object();

			for (i = 0; i < items.length; i++ )
			{
			var _question = new this.Question();
				_question.ID = items[i].ID;
				_question.A_GRM = items[i].A_GRM;

			for (j = 0; j < items[i].Map.length; j++ )
			{
				_question.Calibration[j] = items[i].Map[j].StepOrder;
				_question.Boundaries[j] = items[i].Map[j].Threshold;

			}
			Calibrations[ _question.ID ] = _question;
			}

			return Calibrations;

		}

		this.calibrate = function (abilityRange, calibrations, matrix){


			for (var i =0 ; i < abilityRange.length; i++){
			
				this.calculateProb(abilityRange[i], calibrations);
				this.calculateVari(abilityRange[i], calibrations);
			
				var QuestionVariance = new Array();
			
				for (var question in calibrations)
				{
					QuestionVariance[question] = calibrations[question].Vari; 
				}
				matrix[abilityRange[i]] = QuestionVariance;
			}


		}

		this.SetNormalDistribution = function (_array)
		{

			var Mean = 0.0;
			var StdDev = 1.0;
			var tmp = 1.0;
			var distArray = new Array();
			for (var i = 0; i < _array.length; i++) {
				tmp = (_array[i] - Mean) / StdDev;
				distArray[i] = 1 / Math.sqrt(2 * Math.PI) * Math.exp(-0.5 * tmp * tmp);
			}
			
			return distArray;
		}


		this.displayResults = function(){
			var itemScores = [];
			var transmissionScoreObject = {};

			for(var i=0 ; i <  this.responses.length; i++){
				var itemScoreObject = {};
				
				itemScoreObject.field_name = this.responses[i].ID;
				itemScoreObject.value = this.responses[i].Response;
				itemScoreObject.Theta = parseInt(this.responses[i].Ability *100)/100.0;
				itemScoreObject.SE = parseInt(this.responses[i].SE *100)/100.0;
				
				transmissionScoreObject['cat_' + itemScoreObject.field_name.toLowerCase()] = itemScoreObject.value;

				itemScores.push(itemScoreObject);
			}
			this.responses = new Array();
			return {itemScores:itemScores, transmissionScores:transmissionScoreObject};
		}


		this.estimateTheta = function(obj){

			QAProbability = this.calculateItemResponseProb(this.ID, obj, this.Calibrations,this.AbilityRange);

			var calculatedAbilityNumerator = 0.0;
			var calculatedAbilityDenomenator = 0.0;
			var calculatedErrorNumerator = 0.0;
			var EAP = new Array();
			
			for(var j=0; j < QAProbability.length; j++){
				this.LikelyHood[j] = this.LikelyHood[j] *  QAProbability[j];
				this.LikelyHoodEstimate[j] = this.LikelyHoodEstimate[j] *  QAProbability[j];
				calculatedAbilityNumerator = calculatedAbilityNumerator + (this.AbilityRange[j]  * this.LikelyHoodEstimate[j]);
				calculatedAbilityDenomenator = calculatedAbilityDenomenator + this.LikelyHoodEstimate[j];
			}
		
			this.ability = calculatedAbilityNumerator/calculatedAbilityDenomenator;
			
			
			for(var k=0; k < this.AbilityRange.length; k++){
				EAP[k] = Math.pow( (this.AbilityRange[k] - this.ability) ,2);
				EAP[k] =  EAP[k] * this.LikelyHoodEstimate[k] ;
				calculatedErrorNumerator = calculatedErrorNumerator + EAP[k];
			}

			this.StandardError = Math.sqrt(calculatedErrorNumerator/calculatedAbilityDenomenator);
			this.Calibrations[this.ID].Administered = true;
			this.responses[this.responses.length] = new this.Results(this.ID, obj, this.ability, this.StandardError );

			newscore = new Object();
            newscore.tscore = this.ability;
            newscore.se = this.StandardError;
            
			//var newscore = "{\"tscore\":\"" + this.ability+ "\"," + "\"se:\"" + this.StandardError + "\"" + "}"
			$scope.scores.push(newscore); 
			localStorage['scores'] = JSON.stringify($scope.scores);
			//console.log(JSON.parse(myarray) +":"+ newscore.se);
			//myarray.push(newscore);
			//$rootScope.scores.push(newscore);

			return this.ability;
		
		}


		
		this.setAbilityRange = function(){
			//"TODO:read properties from  this.calibration.Properties";
			for(var i = 0; i < parseInt(10* (this.ability_max - this.ability_min)) + 1; i++){
				this.AbilityRange[i] = this.ability_min + (.1 * i);
			}
		}
		
		this.next = function(){
			this.display();
		}

		this.display = function(){

			var nextItem = this.getNextItem(this.Calibrations, this.Matrix,this.AbilityRange,this.LikelyHood);
			this.ID = nextItem;
			return nextItem;
		}

		this.processResponse = function(FormItemOID,ItemResponseOID){

			var response;

			for(var i=0; i < this.calibration.Items.length; i++){
				if(FormItemOID == this.calibration.Items[i].FormItemOID){
				
					for(j=0; j < this.calibration.Items[i].Map.length; j++){
						if(ItemResponseOID == this.calibration.Items[i].Map[j].ItemResponseOID ){
							response = parseInt(this.calibration.Items[i].Map[j].StepOrder);
							break;
						}
					}
					
					if(typeof(response)  == 'undefined' ){ // boundary condition
						response = this.calibration.Items[i].Map.length + 1;
					}
					
				}
			}
			this.ability =  this.estimateTheta(response);
			//"TODO:read properties from  this.calibration.Properties";
			
			if( (this.responses[this.responses.length-1].SE < .3 && this.responses.length > 3) || this.responses.length > 10 ){
					this.finished = true;
			}

		}
		
	}


	$scope.loadForm();
})



.controller('FinishedCtrl', function($scope) {
  console.log('Survey is finished.');
})
