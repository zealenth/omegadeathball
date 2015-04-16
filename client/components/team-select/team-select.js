'use strict';
var module = angular.module( 'urfApp' );

var TeamSelectCtrl = function( $scope, ChampionModel ) {
  this.champions = _.values( ChampionModel.prototype.CachedModels );
  this.filter = '';
  return this;
};

TeamSelectCtrl.$inject =  [ '$scope', 'ChampionModel'  ];

module
  .controller( 'teamSelectCtrl', TeamnSelectCtrl )
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
