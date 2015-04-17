'use strict';

var _ = require('lodash');
var async = require('async');
var Tree = require('./tree.model');
var Node = require('../node/node.model');
var Edge = require('../edge/edge.model');

// Get a single tree
exports.show = function(req, res) {
  Node.findOne({pkey : req.params.id}, "-_id -__v", function (err, node) {
    if(err) { return handleError(res, err); }
    if(!node) { return res.send(404); }
    var tree = new Tree();

    var maxLevel = 5;
    var minLevel = 1;
    //function traverseUp
    //function traverseDown
    //asyncQueue
    async.parallel([traverseUp, traverseDown],
      function(err, results){
        //merge results
        return res.json(results[0]);
      }
    );

    tree.nodes[node.participants-1] = [[node]];

    function traverseUp(callback) {
      console.log(node.participants + " " + maxLevel);
      if (node.participants < maxLevel) {
        console.log("going up")

        var queue = [];
        var depth = node.participants;
        queue.push(function (callback) { //get edges
          Edge.find(({from : node.pkey}), "-_id -__v",{
              sort: {'weight': -1},
              limit: 5
            },
            function(err, edge){
              if(!node) { return res.send(404); }
              var meh = new Branch();
              meh.node = node;
              meh.edges = edge;
              _.each(edge, function(e){
                tree.edges.push(e);
              });

              callback(err, [edge], tree);
            }
          );
        });

        while (depth++ < maxLevel) {
          //Get nodes and push them to the result
          queue.push(function (edges, tree, callback) { //get nodes
            //console.log(typeof edges + " " + typeof tree + " " + depth);
            var edgeQueue = [];
            _.each(edges, function(edgeArray){
              _.each(edgeArray, function(edge){
                edgeQueue.push(function(callback){
                  Node.findOne({pkey : edge.to}, "-_id -__v", function (err, node) {
                    //if(!node) { return res.send(404); }
                    callback(err, node);
                  });
                });
              });
            });
            async.parallel(edgeQueue, function(err, results){
              callback(err, results, tree);
              //console.log(results);
            });
          });

          //Get edges and push them to the result and merge them with nodes
          queue.push(function (nodes, tree, callback) { //get nodes
            console.log(nodes.length);
            if(nodes.length) {
              tree.nodes[nodes[0].participants-1] = [nodes];
            }
            var nodeQueue = [];
            _.each(nodes, function(node){
              console.log(node.pkey);
              nodeQueue.push(function(callback){
                Edge.find(({from : node.pkey}), "-_id -__v",{
                    sort: {'weight': -1},
                    limit: 1
                  },
                  function(err, edge){
                    if(!node) { return res.send(404); }
                    var meh = new Branch();
                    meh.node = node;
                    meh.edges = edge;
                    _.each(edge, function(e){
                      tree.edges.push(e);
                    });
                    callback(err, edge);
                  }
                );
              });
            });
            async.parallel(nodeQueue, function(err, results){
              callback(err, results, tree);
            });
          });
        }
        async.waterfall(queue, function (err, results) {
          console.log(results);
          console.log(tree.edges.length);
          callback(err, tree);
        });
      } else {
        callback(null, null);
      }
    }

    function traverseDown(callback){
      if(node.participants > 1){
        console.log("going down")
      }
      callback(null, null);
    }
  });
};


//this will probably been in the queue though...


function Branch(){
  return this;
}

function grow(tree, branch){
  console.log(branch);
  if(branch.node.participants == 1){
    tree.l1.push(branch);
  }
  else if(branch.node.participants == 2){
    tree.l2.push(branch);
  }
  else if(branch.node.participants == 3){
    tree.l3.push(branch);
  }
  else if(branch.node.participants == 4){
    tree.l4.push(branch);
  }
  else if(branch.node.participants == 5){
    tree.l5.push(branch);
  }
}

function handleError(res, err) {
  return res.send(500, err);
}
