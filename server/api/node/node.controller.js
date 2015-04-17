'use strict';

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

var _ = require('lodash');
var Node = require('./node.model');

// Get a single node
exports.show = function(req, res) {
  Node.findOne({pkey : req.params.id}, function (err, node) {
    if(err) { return handleError(res, err); }
    if(!node) { return res.send(404); }


    return res.json(node);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
