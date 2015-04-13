'use strict';

angular.module('urfApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Champions',
      'state': 'champ'
    },
    {
      'title': 'Teams',
      'state': 'team'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
