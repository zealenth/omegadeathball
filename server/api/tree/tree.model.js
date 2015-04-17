'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TreeSchema = new Schema({
  l1: [],
  l2: [],
  l3: [],
  l4: [],
  l5: []
});

module.exports = mongoose.model('Tree', TreeSchema);
