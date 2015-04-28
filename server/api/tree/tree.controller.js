'use strict';

var _ = require('lodash');
var async = require('async');
var combination = require('../combination');
var Tree = require('./tree.model');
var Node = require('../node/node.model');
var Edge = require('../edge/edge.model');

// Get a single tree
exports.show = function(req, res) {
  Tree.findOne({pkey: req.params.id}, "-_id -__v", function (err, tree) {
    if (err) {
      return handleError(res, err);
    }

    if (tree){
      return res.json(tree);
    } else {
      Node.findOne({pkey: req.params.id}, "-_id -__v", function (err, node) {
        if (err) {
          return handleError(res, err);
        }
        if (!node) {
          return res.send(new Tree());
        }
        var tree = new Tree();
        tree.pkey = req.params.id;

        var maxLevel = 5;
        var minLevel = 1;
        //function traverseUp
        //function traverseDown
        //asyncQueue
        async.parallel([traverseUp, traverseDown],
          function (err, results) {
            if (err) {
              return handleError(res, err);
            }
            tree.save();
            return res.json(tree);
          }
        );

        tree.nodes[node.participants - 1] = [node];

        function traverseUp(callback) {
          if (node.participants < maxLevel) {

            var queue = [];
            var depth = node.participants;
            queue.push(function (callback) { //get edges
              Edge.find(({from: node.pkey}), "-_id -__v", {
                  sort: {'weight': -1},
                  limit: 5
                },
                function (err, edge) {
                  if (!node) {
                    return res.send(new Tree());
                  }
                  _.each(edge, function (e) {
                    tree.edges.push(e);
                  });

                  callback(err, [edge], tree);
                }
              );
            });

            while (depth++ < maxLevel) {
              //Get nodes and push them to the result
              queue.push(function (edges, tree, callback) { //get nodes
                var pkeyArray = [];
                _.each(edges, function (edgeArray) {
                  _.each(edgeArray, function (edge) {
                    pkeyArray.push(edge.to);
                  });
                });
                console.log(pkeyArray);
                Node.find({pkey: { $in : pkeyArray }}, "-_id -__v", function (err, node) {
                  //if(!node) { return res.send(404); }
                  console.log(node);
                  callback(err, node, tree);
                });
              });

              //Get edges and push them to the result and merge them with nodes
              queue.push(function (nodes, tree, callback) { //get nodes
                if (nodes.length) {
                  tree.nodes[nodes[0].participants - 1] = nodes;
                }
                var nodeQueue = [];
                _.each(nodes, function (node) {
                  nodeQueue.push(function (callback) {
                    Edge.find(({from: node.pkey}), "-_id -__v", {
                        sort: {'weight': -1},
                        limit: 1
                      },
                      function (err, edge) {
                        if (!node) {
                          return res.send(new Tree());
                        }
                        _.each(edge, function (e) {
                          tree.edges.push(e);
                        });
                        callback(err, edge);
                      }
                    );
                  });
                });
                async.parallel(nodeQueue, function (err, results) {
                  callback(err, results, tree);
                });
              });
            }
            async.waterfall(queue, function (err, results) {
              callback(err, tree);
            });
          } else {
            callback(null, null);
          }
        }

        function traverseDown(callback) {
          if (node.participants > minLevel) {
            var nodes = {};
            var links = [];
            combination.traverseCombiantion(node.pkey.split('-'), nodes, links);
            //console.log(nodes);
            tree.edges = tree.edges.concat(makeEdges(links));
            var queryArray = [];
            //console.log(tree.edges);
            _.each(nodes, function(node, key){
              queryArray.push(key.replace(/,/g, '-'));
            });
            Node.find({pkey: { $in : queryArray }}, "-_id -__v", function (err, node) {
              //if(!node) { return res.send(404); }
              _.each(node, function(n){
                //console.log(n.participants);
                if(typeof tree.nodes[n.participants - 1] === 'undefined')
                  tree.nodes[n.participants - 1] = [];
                tree.nodes[n.participants - 1].push(n);

              });
              callback(err, node);
            });
          } else {
            callback(null, null);
          }
        }
      });
    }
  });
};

function makeEdges(links){
  var edgeList = [];

  _.each(links, function(link){
      var from = link[0].join().replace(/,/g, '-');
      var to = link[1].join().replace(/,/g, '-');
      var edge = {};
      edge['edgeId'] = from+":"+to;
      edge['to'] = to;
      edge['from'] = from;
      edge['weight'] = 0;
      edgeList.push(edge);

  });
  return edgeList;
}


function handleError(res, err) {
  return res.send(500, err);
}
