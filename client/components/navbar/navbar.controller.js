'use strict';

angular.module('urfApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Champions',
      'link': '/#/champs'
    },
    {
      'title': 'Teams',
      'link': '/#/teams'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
