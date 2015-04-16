'use strict';
var module = angular.module( 'urfApp' );

var ChampionStatsCtrl = function( $scope, ChampionModel ) {
  this.champion = new ChampionModel( this.championId ).model;
  this.filter = '';
  return this;
};

ChampionStatsCtrl.$inject =  [ '$scope', 'ChampionModel'  ];

module
  .controller( 'championStatsCtrl', ChampionStatsCtrl )
  .directive( 'championStats', function() {
    return {
      controller: 'championStatsCtrl',
      restrict: 'E',
      scope: {
        championId: '='
      },
      bindToController: true,
      controllerAs: 'ctrl',
      templateUrl: 'components/champion-stats/champion-stats.tmpl.html' };
  } );
