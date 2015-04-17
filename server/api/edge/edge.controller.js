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
var Edge = require('./edge.model');

// Get a single edge
exports.show = function(req, res) {
  console.log(req.params);
  Edge.findOne({pkey : req.params.id}, '-_id' , function (err, edge) {
    if(err) { return handleError(res, err); }
    if(!edge) { return res.send(404); }
    return res.json(edge);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
