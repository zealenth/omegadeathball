'use strict';

var _ = require('lodash');
var async = require('async');
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
          return res.send(404);
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

        tree.nodes[node.participants - 1] = [[node]];

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
                    return res.send(404);
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
                var edgeQueue = [];
                _.each(edges, function (edgeArray) {
                  _.each(edgeArray, function (edge) {
                    edgeQueue.push(function (callback) {
                      Node.findOne({pkey: edge.to}, "-_id -__v", function (err, node) {
                        //if(!node) { return res.send(404); }
                        callback(err, node);
                      });
                    });
                  });
                });
                async.parallel(edgeQueue, function (err, results) {
                  callback(err, results, tree);
                });
              });

              //Get edges and push them to the result and merge them with nodes
              queue.push(function (nodes, tree, callback) { //get nodes
                if (nodes.length) {
                  tree.nodes[nodes[0].participants - 1] = [nodes];
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
                          return res.send(404);
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

            var queue = [];
            var depth = node.participants;
            queue.push(function (callback) { //get edges
              Edge.find(({to: node.pkey}), "-_id -__v", {
                  sort: {'weight': -1},
                  limit: 5
                },
                function (err, edge) {
                  if (!node) {
                    return res.send(404);
                  }
                  _.each(edge, function (e) {
                    tree.edges.push(e);
                  });

                  callback(err, [edge], tree);
                }
              );
            });

            while (depth-- > minLevel) {
              //Get nodes and push them to the result
              queue.push(function (edges, tree, callback) { //get nodes
                var edgeQueue = [];
                _.each(edges, function (edgeArray) {
                  _.each(edgeArray, function (edge) {
                    edgeQueue.push(function (callback) {
                      Node.findOne({pkey: edge.from}, "-_id -__v", function (err, node) {
                        //if(!node) { return res.send(404); }
                        callback(err, node);
                      });
                    });
                  });
                });
                async.parallel(edgeQueue, function (err, results) {
                  callback(err, results, tree);
                });
              });

              //Get edges and push them to the result and merge them with nodes
              queue.push(function (nodes, tree, callback) { //get nodes
                if (nodes.length) {
                  tree.nodes[nodes[0].participants - 1] = [nodes];
                }
                var nodeQueue = [];
                _.each(nodes, function (node) {
                  nodeQueue.push(function (callback) {
                    Edge.find(({to: node.pkey}), "-_id -__v", {
                        sort: {'weight': -1},
                        limit: 1
                      },
                      function (err, edge) {
                        if (!node) {
                          return res.send(404);
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
      });
    }
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
