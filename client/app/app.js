'use strict';

angular.module( 'urfApp.models', [] );

angular.module('urfApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'urfApp.models'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/urf');

    /*$locationProvider.html5Mode(true);*/
    console.log( $locationProvider );
  });
