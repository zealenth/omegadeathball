'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NodeSchema = new Schema({
  pkey : String,
  members : [String],
  games : Number,
  kills : Number,
  avg : Number,
  participants : Number,
  edges : { type: String }
});

module.exports = mongoose.model('Node', NodeSchema);
