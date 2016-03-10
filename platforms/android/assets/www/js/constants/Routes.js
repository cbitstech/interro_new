(function() {
  'use strict';

  var Routes = {
    ROOT: '/',
    HOME: '/home',
    CONFIG: '/configure',
    SET_UP: '/set_up',
    RISKY_TIMES: '/risky_times',
    CESSATION_REASONS: '/cessation_reasons',
    RISKY_TIME_STRATEGIES: '/risky_time_strategies',
    EXERCISE: '/exercise',
    TEMPTATION_LOG: '/temptation_log',
    CIGARETTE_LOG: '/cigarette_log',
    SMOKING_STATUS: '/smoking_status',
    SESSIONS: '/session',
    MORNING_EMA: '/morning',
    EVENING_EMA: '/evening',
    MOTIVATION: '/motivation',
    SESSION_SUB_NAV: '/session_sub_nav'
  };

  angular.module('sis.constants')
         .constant('Routes', Routes);
})();
