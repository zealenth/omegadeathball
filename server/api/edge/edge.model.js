'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EdgeSchema = new Schema({
  edgeId: String,
  from: String,
  to: String,
  weight: Number
});

module.exports = mongoose.model('Edge', EdgeSchema);
