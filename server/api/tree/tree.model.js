'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TreeSchema = new Schema({
  pkey: String,
  nodes: [],
  edges: []
});

module.exports = mongoose.model('Tree', TreeSchema);
