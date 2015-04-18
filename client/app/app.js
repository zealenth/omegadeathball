'use strict';

angular.module( 'urfApp.models', [] );

angular.module('urfApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'urfApp.models',
  'ngDragDrop'

])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/urf/team');

    /*$locationProvider.html5Mode(true);*/
    console.log( $locationProvider );
  });
