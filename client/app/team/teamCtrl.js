'use strict';
var module = angular.module( 'urfApp' );
//todo: change to controllerAs
module.controller( 'teamViewCtrl', [ '$scope', '$state', '$stateParams', function( $scope, $state, $stateParams ) {
  $scope.selectedTeamId = $stateParams.team || '';

  $scope.changeState = function( view, params ) {
    if( !params ) {
      params = {};
    }
    $state.go( view, params );
  };

  $scope.$watch( 'selectedTeamId', function( newVal, oldVal ) {
    if( newVal && newVal !== oldVal) {
      $scope.changeState( 'main.team.id',  { team: newVal } );
    }
  });
  return this;
} ] );
