'use strict';
var module = angular.module( 'urfApp' );

module.controller( 'teamViewCtrl', [ '$scope', '$state', function( $scope, $state ) {
  $scope.championId = '';

  $scope.changeState = function( view, params ) {
    if( !params ) {
      params = {};
    }
    $state.go( view, params );
  };

  $scope.$watch( 'teamId', function( newVal, oldVal ) {
    console.log( newVal );
    if( newVal && newVal !== oldVal) {
      $scope.changeState( 'main.team.id',  { id: $scope.teamId } );
    }
  });
  return this;
} ] );
