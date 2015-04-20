//jquery hack, we don't have bootstrop popovers:


function TeamStatsCtrl( $scope, Model, $element, ChampionModel ) {
  var self = this;
  this.champions = ChampionModel.prototype.CachedModels;
  var teamModel = new Model( { url: '/api/trees/' + this.teamId } );
  teamModel.fetch().then( function() {
    var dataNodes = [];
    _.each( teamModel.model.nodes, function( n ) {
      _.each( n, function( n2 ) {
        dataNodes = dataNodes.concat( n2 );
      } );
    } );
    //self.initD3( $element, dataNodes );
    self.initD3Graph( $element, dataNodes );
  } );
  this.teamData = teamModel.model;
  return this;
}

TeamStatsCtrl.prototype.initD3 = function( $element, dataNodes ) {
    var self = this;
    var width = 500, height = 500;
    var fill = d3.scale.ordinal().range(['#827d92','#827354','#523536','#72856a','#2a3285','#383435'])
    var svg = d3.select( $element[0] ).append("svg")
      .attr("width", width)
      .attr("height", height);


    for (var j = 0; j < dataNodes.length; j++) {
      dataNodes[j].radius = +dataNodes[j].kills / dataNodes[j].games * 12;
      dataNodes[j].x = Math.random() * width;
      dataNodes[j].y = Math.random() * height;
      dataNodes[j].teamName = dataNodes[j].members.map( function( e ) {
        return self.champions[e].name.substring(0,3);
        } )
        .join( '-' );
    }

    var padding = 2;
    var maxRadius = d3.max(_.pluck(dataNodes, 'radius'));

    var getCenters = function (vname, size) {
      var centers, map;
      centers = [ { name: 'Champion Kills By Group', value: 1 } ]; /* _.uniq(_.pluck(data, vname)).map(function (d) {
        return {name: d, value: 1};
      });*/

      map = d3.layout.treemap().size(size).ratio(1/1);
      map.nodes({children: centers});

      return centers;
    };

    var nodes = svg.selectAll("g.node")
      .data(dataNodes)
      .enter()
      .append('g')
      .on("mouseover", function (d) { showPopover.call(this, d); })
      .on("mouseout", function (d) { removePopovers(); })
      .attr("class", "node")
      .attr("transform", function(d){
        return "translate(" + d.x + "," + d.y + ")";
      });

    nodes.append("circle")
      .attr("class", "node")
      .attr("r", function (d) { return d.radius; })
      .style("fill", function (d) { return fill(d.teamName); })


    nodes.append( 'text' )
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.teamName; });

  var link = svg.selectAll("line")
    .data(self.teamData.edges)
    .enter().append("svg:line");

    var force = d3.layout.force();

    draw('Champion Kills By Group');

    $( ".btn" ).click(function() {
      draw(this.id);
    });

    function draw (varname) {
      var centers = getCenters(varname, [width, height]);
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

        var k = 6 * e.alpha;

        nodes.each(collide(.11))
          .attr("transform", function(d){
            return "translate(" + d.x + "," + d.y + ")";
          } );

        link.attr("x1", function(d) { return d.x - k; })
          .attr("y1", function(d) { return d.y - k; })
          .attr("x2", function(d) { return d.x + k; })
          .attr("y2", function(d) { return d.y + k; });
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
          return "Team: <br/>" + d.members.map( function( e ) {
            return ' ' + self.champions[e].name;
          } ).join( '<br/>' ) + "<br/>Kills per game: " + d.kills / d.games +
            "<br/>Games: " + d.games;
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

TeamStatsCtrl.prototype.initD3Graph = function( $element, dataNodes ) {
  var mapper = {};
  var incr = 0;
  var maxGames = d3.max( dataNodes, function(d) { return d.games; } );
  var gameFill = d3.scale.ordinal().range(['#827d92','#827354','#523536','#72856a','#2a3285','#383435'])

  var self = this;
  var w = 900,
    h = 900,
    r = 6,
    fill = d3.scale.category20();

  var force = d3.layout.force()
    .charge(-2200)
    .linkDistance(100);

  var svg = d3.select($element[0]).append("svg:svg")
    .style("height", "100vh")
    .style("width", "100%");

    var link = svg.selectAll("line")
      .data(self.teamData.edges)
      .enter().append("svg:line");

    //var node = svg.selectAll("circle")
    //  .data(self.teamData.flat)
    //  .enter().append("svg:circle")
    //  .attr("r", function(d) { return 20 + (d.kills / d.games * 5) })
    //  .style("fill", function(d) { return fill(d.group); })
    //  .style("stroke", function(d) { return d3.rgb(fill(d.group)).darker(); })
    //  .call(force.drag);

    var node = svg.selectAll("g.node")
      .data(dataNodes)
      .enter()
      .append('g')
      .attr("class", "node")
      .on("mouseover", function (d) { showPopover.call(this, d); })
      .on("mouseout", function (d) { removePopovers(); })
      .call(force.drag);

    node
      .append("circle")
      .attr("class", "node")
      .attr("r", function(d) { return 10 + (d.kills / d.games * 10) })
      .style("stroke", function(d) { return d3.rgb(fill(d.group)).darker(); })
      .style("fill", function (d) { return gameFill( d.games ); });

    node.append( 'text' )
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) {
        return d.members.map(
          function( e ) {
            return self.champions[e].name;
          }).join( ' ' );})
      .call(wrap, 30);


    link.each(function(d){
      d.source = toNum(d.from);
      d.target = toNum(d.to);
    });


    force
      .nodes(dataNodes)
      .links(self.teamData.edges)
      .on("tick", tick)
      .start();

    resize();
    d3.select(window).on("resize", resize);

    function tick(e) {
      // Push sources up and targets down to form a weak tree.
      var k = 6 * e.alpha;
      self.teamData.edges.forEach(function(d, i) {
        d.source.y -= k;
        d.target.y += k;
      });
      //
      //node.attr("cx", function(d) { return d.x; })
      //  .attr("cy", function(d) { return d.y; });
      node.attr("transform", function(d){
        return "translate(" + d.x + "," + d.y + ")";
      });

      link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    }

  function resize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    svg.attr("width", width).attr("height", height);
    force.size([width, height]).resume();
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
        return "Team: <br/>" + d.members.map( function( e ) {
            return ' ' + self.champions[e].name;
          } ).join( '<br/>' ) + "<br/>Kills per game: " + d.kills / d.games +
          "<br/>Games: " + d.games;
      }
    });
    $(this).popover('show')
  }

  function wrap(text, width) {
    text.each(function () {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.5 * parseFloat(text.attr("dy")), // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + "em").text(word);
        }
      }
    });
  }

  function toNum(obj){
    if( typeof mapper[obj] === 'undefined' ) {
      mapper[obj] = incr;
      incr++;
    }
    return mapper[obj];
  }
};

TeamStatsCtrl.$inject = [ '$scope', 'Model', '$element', 'ChampionModel' ];

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
