'use strict';

var module = angular.module( 'urfApp' );

module.controller( 'championViewCtrl', [ '$scope', '$state', function( $scope, $state ) {
    $scope.championId = '';

    $scope.changeState = function( view, params ) {
      if( !params ) {
        params = {};
      }
      $state.go( view, params );
    };

    $scope.$watch( 'selectedChamp', function( newVal, oldVal ) {
      console.log( newVal );
      if(newVal && newVal !== oldVal) {
        $scope.changeState( 'main.champ.id',  { id: $scope.selectedChamp } );
      }
    });
    return this;
} ] );
