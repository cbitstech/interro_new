(function() {
  'use strict';

  function GraphController() {

    debugger;
    var data = _.map(JSON.parse(localStorage.scores),'tscore');

     $('#highcharts-history').highcharts({
        title: {
            text: 'Depression Scores',
            x: -20 //center
        },
        subtitle: {
            text: '',
            x: -20
        },
        xAxis: {
            categories: []
        },
        yAxis: {
            title: {
                text: ''
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ''
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Depression',
            data: data
        }]
    });

  }

  angular.module('sis.controllers')
    .controller('GraphController',
    [GraphController]);
})();
