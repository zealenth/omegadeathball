'use strict';

angular.module('urfApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('champ', {
        url: '/champ',
        templateUrl: 'app/champion/champion.html'
      })
      .state('champ.id', {
        url: '/:id',
        templateUrl: 'app/champion/champ-stats.html'
      })
      .state('team', {
        url: '/team',
        templateUrl: 'app/team/team.html'
      })
      .state('team.id', {
        url: '/:id',
        templateUrl: 'app/team/team-stats.html'
      });
  });
