var _ = require('underscore');
var fs = require('fs');
var parser = require('./parse.controller');
var dir = '/home/code/vmshare/match-2/matches';

fs.readdir(dir, function(err, data){
  if (err) {
    console.log(err);
  }
  var nodeMap = {};
  var edgeMap = {};

  var count = 0;

  _.each(data, function(name) {
    var contents;
    try {
      if(count % 100 === 0){
        console.error("processed matches: " + count);
      }
      contents = fs.readFileSync(dir + '/' + name);
      parser.processMatch(contents, nodeMap, edgeMap);
      count++;
    } catch (e) {
      console.error(name);
      console.error(e);
    }
  });
  gephiNodeStuff(nodeMap, edgeMap);
});

function gephiNodeStuff(nodeMap, edgeMap){
  console.log("nodedef>name VARCHAR,kills DOUBLE,participants DOUBLE,games DOUBLE, avg DOUBLE");
  var keys = [];
  var gameCount = 0;
  var killCount = 0;
  _.each(nodeMap, function(stuff, key){
    keys.push(key);
  });
  keys.sort();
  _.each(keys, function(key){
    if(nodeMap[key].kills >= killCount && nodeMap[key].games >= gameCount) {
      console.log(key + "," + nodeMap[key].kills + "," + nodeMap[key].participants +
      "," + nodeMap[key].games + "," + Math.round((nodeMap[key].kills / nodeMap[key].games) * 1000)/1000);
    }
  });
  console.log("edgedef>node1 VARCHAR,node2 VARCHAR,weight DOUBLE");
  _.each(edgeMap, function(edge, key){
    _.each(edgeMap[key], function(value, to){
      console.log(key + "," + to + "," + value);
    });
  });
}
