'use strict';
var module = angular.module( 'urfApp' );

var TeamSelectCtrl = function( $scope, ChampionModel ) {
  var self = this;
  this.champions = _.values( ChampionModel.prototype.CachedModels );
  this.hilightedChampions = [];
  this.selectedChampions = [];
  this.filter = '';

  $scope.onDropCallback = function() {
    var champ = arguments[1].helper[0].getAttribute( 'data-drag' );
    console.log(champ);
    //remove champ from champions
    var champIndex = _.findIndex( self.champions, function(elem) { return parseInt(  elem.id ) === parseInt( champ ); } );
    console.log( champIndex );
    console.log(self.champions);
    self.selectedChampions.push( self.champions[ champIndex ] );
    self.champions.splice( champIndex, 1 );
    //add to
    //console.log( arguments );

    $scope.$digest();
  };
  return this;
};

TeamSelectCtrl.$inject =  [ '$scope', 'ChampionModel'  ];

module
  .controller( 'teamSelectCtrl', TeamSelectCtrl )
  .directive( 'teamSelect', function() {
    return {
      controller: 'teamSelectCtrl',
      restrict: 'E',
      scope: {
        teamId: '='
      },
      bindToController: true,
      controllerAs: 'ctrl',
      templateUrl: 'components/team-select/team-select.tmpl.html' };
  } );
