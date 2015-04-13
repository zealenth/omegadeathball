var module = angular.module( 'urfApp' );

module.controller( 'championViewCtrl', [ '$scope', '$state', function( $scope, $state ) {
    $scope.championId = '';

    $scope.changeState = function( view, params ) {
      if( !params ) {
        params = {};
      }
      $state.go( view, params );
    };
    return this;
} ] );
