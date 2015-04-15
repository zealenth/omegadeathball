'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NodeSchema = new Schema({
  pkey : String,
  members : [String],
  games : Number,
  kills : Number,
  participants : Number
});

module.exports = mongoose.model('Node', NodeSchema);
