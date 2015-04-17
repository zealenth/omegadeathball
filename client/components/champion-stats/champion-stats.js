'use strict';
var module = angular.module( 'urfApp' );

var ChampionStatsCtrl = function( $scope, ChampionModel, Model ) {
  this.champion = new ChampionModel( this.championId ).model;
  this.champions = ChampionModel.prototype.CachedModels;
  var urfModel = new Model( { url: '/urf/' + this.championId } );
  urfModel.fetch();
  this.selectedUrfStats = urfModel.model;
  this.filter = '';
  return this;
};

ChampionStatsCtrl.prototype.getChampName = function( champId ) {
  if( this.champions[ champId ] ) {
    return this.champions[ champId ].name;
  }
  console.log( 'missing champ: ' + champId );
  return '';
};

ChampionStatsCtrl.$inject =  [ '$scope', 'ChampionModel', 'Model'  ];

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
