var module = angular.module( 'urfApp' );

var championSelectCtrl = function( $scope ) {

};

championSelectCtrl.prototype.$inject( '$scope' );

module
  .controller( 'championSelectCtrl', championSelectCtrl )
  .directive( 'championSelect', function() {
    return {
      controller: 'championSelectCtrl',
      restrict: 'E',
      scope: {
        championId: '=',
        onSelect: '&'
      },
      templateUrl: 'app/components/champion-select/champion-select.tmpl.html' };
  } );;
