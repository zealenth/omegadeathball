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

    //begin magical chain journey
    Edge.find(({from : node.pkey}), "-_id -__v",{
        sort: {'weight': -1},
        limit: 5
      },
      function(err, edge){
        if(err) { return handleError(res, err); }
        if(!edge) { return res.send(404); }
        var meh = new Branch();
        meh.node = node;
        meh.edges = edge;
        var queue = [];
        _.each(edge, function(e){
          queue.push(
            function(callback) {
              Node.findOne({pkey : e}, "-_id -__v", function (err, node) {
                callback(err, node);
              });
            }
          );
        });
        async.parallel(queue, function(err, results){
          if(err) { return handleError(res, err); }
          console.log(results);
          grow(tree, meh);
          console.log(edge);
          return res.json(tree);
        });
    });
  });
};

function Branch(){
  return this;
}

function Node(){
  this.members = [];
  this.games = 0;
  this.kills = 0;
  this.avg = 0;
  this.participants = 0;

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
