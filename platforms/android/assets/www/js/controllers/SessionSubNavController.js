(function () {
  'use strict';

  function SessionSubNavController() {

    this.SECTIONS = [
        {
          label: 'Your Reasons for Quitting', 
          startVariable: 'session1_1', 
          endVariable: 'session1_3', 
          sessionAvailable: 1
        },
        {
          label: 'Benefits of Quitting', 
          startVariable: 'session1_1', 
          endVariable: 'session1_3', 
          sessionAvailable: 1
        },
        {
          label: 'Scheduling Your Quit Day', 
          startVariable: 'session1_1',
          endVariable: 'session1_3', 
          sessionAvailable: 1
        },
        {
          label: 'Concerns About Quitting', 
          startVariable: 'session1_1', 
          endVariable: 'session1_3', 
          sessionAvailable: 1
        },
        {
          label: 'Managing Your Challenging Times', 
          startVariable: 'session1_1',
          endVariable: 'session1_3',
          sessionAvailable: 1
        },
        {
          label: 'Enlisting Your Social Support', 
          startVariable: 'session1_1', 
          endVariable: 'session1_3',
          sessionAvailable: 1
        },
        { 
          label: 'Combating Sabotaging Thoughts', 
          startVariable: 'session1_1', 
          endVariable: 'session1_3',
          sessionAvailable: 3
        }];

    this.currentSessionAvailable = function() {
      return 1;
    };
  }

  angular.module('sis.controllers')
    .controller('SessionSubNavController',
    [SessionSubNavController]);
})();
