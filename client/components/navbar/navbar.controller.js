'use strict';

angular.module('urfApp')
  .controller('NavbarCtrl', [ '$scope', '$location', '$state', function ($scope, $location, $state) {
    $scope.menu = [{
      'title': 'Champions',
      'state': 'main.champ'
    },
    {
      'title': 'Teams',
      'state': 'main.team'
    }];

    $scope.isCollapsed = true;

    $scope.changeState = function( view, params ) {
      if( !params ) {
        params = {};
      }
      $state.go( view, params );
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  }]);
