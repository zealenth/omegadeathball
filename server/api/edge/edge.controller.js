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

// Get list of edges
exports.index = function(req, res) {
  Edge.find(true,'-_id -__v', function (err, edges) {
    if(err) { return handleError(res, err); }
    return res.json(200, edges);
  });
};

// Get a single edge
exports.show = function(req, res) {
  console.log(req.params);
  Edge.findById(req.params.id, '-_id' , function (err, edge) {
    if(err) { return handleError(res, err); }
    if(!edge) { return res.send(404); }
    return res.json(edge);
  });
};

// Creates a new edge in the DB.
exports.create = function(req, res) {
  Edge.create(req.body, function(err, edge) {
    if(err) { return handleError(res, err); }
    return res.json(201, edge);
  });
};

// Updates an existing edge in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Edge.findById(req.params.id, function (err, edge) {
    if (err) { return handleError(res, err); }
    if(!edge) { return res.send(404); }
    var updated = _.merge(edge, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, edge);
    });
  });
};

// Deletes a edge from the DB.
exports.destroy = function(req, res) {
  Edge.findById(req.params.id, function (err, edge) {
    if(err) { return handleError(res, err); }
    if(!edge) { return res.send(404); }
    edge.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
