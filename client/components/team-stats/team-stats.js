

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
    var width = 800, height = 800;
    var fill = d3.scale.ordinal().range(['#827d92','#827354','#523536','#72856a','#2a3285','#383435'])
    var svg = d3.select( $element[0] ).append("svg")
      .attr("width", width)
      .attr("height", height);
    var dataNodes = [];
    _.each( this.teamData.nodes, function( n ) {
      _.each( n, function( n2 ) {
        dataNodes = dataNodes.concat( n2 );
      } );
    } );

    for (var j = 0; j < dataNodes.length; j++) {
      dataNodes[j].radius = +dataNodes[j].kills / dataNodes[j].games * 5;
      dataNodes[j].x = Math.random() * width;
      dataNodes[j].y = Math.random() * height;
      dataNodes[j ].teamName = dataNodes[j].members.join( '-' );
    }

    var padding = 2;
    var maxRadius = d3.max(_.pluck(dataNodes, 'radius'));

    var getCenters = function (vname, size) {
      var centers, map;
      centers = [ { name: 'stuff', value: 1 } ]; /* _.uniq(_.pluck(data, vname)).map(function (d) {
        return {name: d, value: 1};
      });*/

      map = d3.layout.treemap().size(size).ratio(1/1);
      map.nodes({children: centers});

      return centers;
    };

    var nodes = svg.selectAll("circle")
      .data(dataNodes);

    nodes.enter().append("circle")
      .attr("class", "node")
      .attr("cx", function (d) { return d.x; })
      .attr("cy", function (d) { return d.y; })
      .attr("r", function (d) { return d.radius; })
      .style("fill", function (d) { return fill(d.teamName); })
      .on("mouseover", function (d) { showPopover.call(this, d); })
      .on("mouseout", function (d) { removePopovers(); })

    var force = d3.layout.force();

    draw('stuff');

    $( ".btn" ).click(function() {
      draw(this.id);
    });

    function draw (varname) {
      var centers = getCenters(varname, [800, 800]);
      force.on("tick", tick(centers, varname));
      labels(centers)
      force.start();
    }

    function tick (centers, varname) {
      var foci = {};
      for (var i = 0; i < centers.length; i++) {
        foci[centers[i].name] = centers[i];
      }
      return function (e) {
        for (var i = 0; i < dataNodes.length; i++) {
          var o = dataNodes[i];
          var f = foci[ varname ];
          o.y += ((f.y + (f.dy / 2)) - o.y) * e.alpha;
          o.x += ((f.x + (f.dx / 2)) - o.x) * e.alpha;
        }
        nodes.each(collide(.11))
          .attr("cx", function (d) { return d.x; })
          .attr("cy", function (d) { return d.y; });
      }
    }

    function labels (centers) {
      svg.selectAll(".label").remove();

      svg.selectAll(".label")
        .data(centers).enter().append("text")
        .attr("class", "label")
        .text(function (d) { return d.name })
        .attr("transform", function (d) {
          return "translate(" + (d.x + (d.dx / 2)) + ", " + (d.y + 20) + ")";
        });
    }

    function removePopovers () {
      $('.popover').each(function() {
        $(this).remove();
      });
    }

    function showPopover (d) {
      $(this).popover({
        placement: 'auto top',
        container: 'body',
        trigger: 'manual',
        html : true,
        content: function() {
          return "Make: " + d.make + "<br/>Model: " + d.model +
            "<br/>Trans: " + d.trans + "<br/>MPG: " + d.comb;
        }
      });
      $(this).popover('show')
    }

    function collide(alpha) {
      var quadtree = d3.geom.quadtree(dataNodes);
      return function (d) {
        var r = d.radius + maxRadius + padding,
          nx1 = d.x - r,
          nx2 = d.x + r,
          ny1 = d.y - r,
          ny2 = d.y + r;
        quadtree.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
            var x = d.x - quad.point.x,
              y = d.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r = d.radius + quad.point.radius + padding;
            if (l < r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }

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
