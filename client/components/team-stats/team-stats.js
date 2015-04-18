

function TeamStatsCtrl( $scope, Model, $element ) {
  var self = this;
  var teamModel = new Model( { url: '/api/trees/' + this.teamId } );
  teamModel.fetch().then( function() {
    self.initD3( $element );
  } );
  this.teamData = teamModel.model;
  return this;
}

TeamStatsCtrl.prototype.initD3 = function( $element ) {
  var diameter = 960,
    format = d3.format(",d"),
    color = d3.scale.category20c();

  var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

  var svg = d3.select( $element[0] ).append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

  //flatten nodes into one array
  var dataNodes = [];
  _.each( this.teamData.nodes, function( n ) {
    _.each( n, function( n2 ) {
      dataNodes = dataNodes.concat( n2 );
    } );
  } );
  console.log( dataNodes );
  var node = svg.selectAll(".node")
    .data(bubble.nodes( dataNodes ) )
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";}
    );

  node.append("title")
    .text(function(d) { return d.className + ": " + format(d.value); });

  node.append("circle")
    .attr("r", function(d) {
      return d.r; }
  )
    .style("fill", function(d) { return color(d.packageName); });

  node.append("text")
    .attr("dy", ".3em")
    .style("text-anchor", "middle")
    .text(function(d) { return d.className.substring(0, d.r / 3); });


// Returns a flattened hierarchy containing all leaf nodes under the root.
  function classes(root) {
    var classes = [];

    function recurse(name, node) {
      if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
      else classes.push({packageName: name, className: node.name, value: node.size});
    }

    recurse(null, root);
    return {children: classes};
  }

  d3.select(self.frameElement).style("height", diameter + "px");
};


TeamStatsCtrl.$inject = [ '$scope', 'Model', '$element' ];

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
