'use strict';
var module = angular.module( 'urfApp' );

var ChampionSelectCtrl = function( $scope, ChampionModel ) {
  this.champions = _.values( ChampionModel.prototype.CachedModels );
  this.filter = '';
  return this;
};

ChampionSelectCtrl.$inject =  [ '$scope', 'ChampionModel'  ];

module
  .controller( 'championSelectCtrl', ChampionSelectCtrl )
  .directive( 'championSelect', function() {
    return {
      controller: 'championSelectCtrl',
      restrict: 'E',
      scope: {
        championId: '='
      },
      bindToController: true,
      controllerAs: 'ctrl',
      templateUrl: 'components/champion-select/champion-select.tmpl.html' };
  } );
