

function TeamStatsCtrl( $scope, Model ) {

  var teamModel = new Model( { url: '/api/trees/' + this.teamId } );
  teamModel.fetch();
  this.teamData = teamModel.model;

  return this;
}

TeamStatsCtrl.$inject = [ '$scope', 'Model' ];

angular.module( 'urfApp' )
  .controller( 'teamStatsCtrl', TeamStatsCtrl )
  .directive( 'teamStats',  function() {
    return {
      controller: 'teamStatsCtrl',
      restrict: 'E',
      scope: {
        teamId: '='
      },
      bindToController: true,
      controllerAs: 'ctrl',
      templateUrl: 'components/team-stats/team-stats.tmpl.html' };
  } );
