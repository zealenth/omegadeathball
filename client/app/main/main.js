'use strict';

angular.module('urfApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/urf',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('main.champ', {
        url: '/champ',
        templateUrl: 'app/champion/champion.html'
      })
      .state('main.champ.id', {
        url: '/:id',
        templateUrl: 'app/champion/champion-stats.html',
        controller: [ '$scope','$stateParams', function( $scope, $stateParams ) {
          $scope.championId = $stateParams.id;
        } ]
      })
      .state('main.team', {
        url: '/team',
        templateUrl: 'app/team/team.html'
      })
      .state('main.team.id', {
        url: '/:id',
        templateUrl: 'app/team/team-stats.html',
        controller: [ '$scope','$stateParams', function( $scope, $stateParams ) {
          $scope.teamId = $stateParams.id;
        } ]
      });
  });
