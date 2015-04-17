'use strict';
var module = angular.module( 'urfApp' );

var TeamSelectCtrl = function( $scope, ChampionModel ) {
  var self = this;
  this.champions = _.values( ChampionModel.prototype.CachedModels );
  this.hilightedChampions = [];
  this.selectedChampions = [];
  this.filter = '';
  this.lastHilightDirection = 'left';

  $scope.onDropCallback = function() {
    var champ = arguments[1].helper[0].getAttribute( 'data-drag' );
    console.log(champ);
    //remove champ from champions
    var champIndex = _.findIndex( self.champions, function(elem) { return parseInt(  elem.id ) === parseInt( champ ); } );
    console.log( champIndex );
    console.log(self.champions);
    self.selectedChampions.push( self.champions[ champIndex ] );
    self.champions.splice( champIndex, 1 );

    $scope.$digest();
  };

  this.addHilightedChamp = function( champ ) {
    var direction = 'left';

    if( _.indexOf( this.selectedChampions, function( c ) { return c.id === champ; } ) ) {
      direction = 'right';
    }
    if( direction !== this.lastHilightDirection ) {
      this.lastHilightDirection = direction;
      this.hilightedChampions = [];
    }
    if( _.indexOf( this.hilightedChampions, champ ) !== -1 ) {
      this.hilightedChampions.splice( _.indexOf( this.hilightedChampions, champ ), 1 );
    }
    else {
      this.hilightedChampions.push( champ );
    }
  };

  this.moveChampsLeft = function() {

  };
  this.moveChampsRight = function() {

  };

  this.selectedClass = function( champ ) {
    if( _.indexOf( this.hilightedChampions, champ ) !== -1 ) {
      return 'selected';
    }
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
