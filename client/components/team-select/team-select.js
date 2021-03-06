'use strict';
var module = angular.module( 'urfApp' );

var TeamSelectCtrl = function( $scope, ChampionModel ) {
  var self = this;
  this.champions = _.values( ChampionModel.prototype.CachedModels );
  this.hilightedChampions = this.teamId ? this.teamId.split( '-' ).map( function( e ) { return parseInt( e ); } ) : [];
  this.selectedChampions = [];
  this.filter = '';
  this.lastHilightDirection = 'left';

  $scope.onDropCallback = function() {
    var champ = arguments[1].helper[0].getAttribute( 'data-drag' );

    //remove champ from champions
    var champIndex = _.findIndex( self.champions, function(elem) { return parseInt(  elem.id ) === parseInt( champ ); } );
    self.selectedChampions.push( self.champions[ champIndex ] );
    self.champions.splice( champIndex, 1 );
    self.hilightedChampions = [];
    self.updateSelectedChampionIds();
    $scope.$digest();
  };

  this.updateSelectedChampionIds = function() {
    var self = this;
    self.teamId = self.selectedChampions.map( function( e ) { return parseInt( e.id ) } )
      .sort( function(a,b) { return a >=b } )
      .join( '-' );
    if( !$scope.$$phase && !$scope.$root.$$phase )
    {
      $scope.$apply();
    }
  };

  this.addHilightedChamp = function( champ ) {
    var direction = 'left';

    if( _.findIndex( this.selectedChampions, function( c ) { return c.id === champ; } ) !== -1 ) {
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
    var self = this;
    _.each( this.hilightedChampions, function( c ) {
      var i = _.findIndex( self.selectedChampions, function( e ) { return e.id === c; } );
      if( i !== -1 ) {
        var m = self.selectedChampions.splice( i, 1 );
        self.champions.push( m[ 0 ] );
      }
    } );
    this.updateSelectedChampionIds();
    this.hilightedChampions = [];
  };
  this.moveChampsRight = function() {
    var self = this;
    _.each( this.hilightedChampions, function( c ) {
      var i = _.findIndex( self.champions,  function( e ) { return e.id === c; } );
      if( i !== -1 ) {
        var m = self.champions.splice( i, 1 );
        self.selectedChampions.push( m[ 0 ] );
      }
    } );
    this.updateSelectedChampionIds();
    this.hilightedChampions = [];
  };

  this.selectedClass = function( champ ) {
    if( _.indexOf( this.hilightedChampions, champ ) !== -1 ) {
      return 'selected';
    }
  };

  this.submitChamp = function( keyEvent ) {
    if (keyEvent.which === 13) {
      var champs = $scope.$eval( "ctrl.champions | filter : ctrl.leftFilter | orderBy: 'name'");
      if( champs.length ) {
        this.addChamp( champs[0].id );
      }
      this.leftFilter='';
    }
  };
  this.removeChamp = function( c ) {
    var i = _.findIndex( self.selectedChampions,  function( e ) { return e.id === c; } );
    if( i !== -1 ) {
      var m = self.selectedChampions.splice( i, 1 );
      self.champions.push( m[ 0 ] );
    }
    this.updateSelectedChampionIds();
  };
  this.addChamp = function( c ) {
    var i = _.findIndex( self.champions,  function( e ) { return e.id === c; } );
    if( i !== -1 ) {
      var m = self.champions.splice( i, 1 );
      self.selectedChampions.push( m[ 0 ] );
    }
    this.updateSelectedChampionIds();
  };
  this.moveChampsRight();
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
