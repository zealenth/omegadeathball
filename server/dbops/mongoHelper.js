var Parser = require('./../api/parse.controller.js');
var _ = require('underscore');
var fs = require('fs');

var dir = '/home/code/vmshare/matches';
//var dir = './matches';

fs.readdir(dir, function(err, data){
  if (err) {
    console.log(err);
    console.log(process.cwd());
  }

  var nodeMap = {};
  var edgeMap = {};
  var count = 0;

  _.each(data, function (name) {
    var contents;
    try {
      if(count % 100 === 0){
        console.error("processed matches: " + count);
      }
      contents = fs.readFileSync(dir + '/' + name);
      Parser.processMatch(contents, nodeMap, edgeMap);
      count++;
    } catch (e) {
      console.error(name);
      console.error(e);
    }
  });

  genNodeFile(nodeMap);
  genEdgeFile(edgeMap);

});

function genNodeFile(nodeMap){

  if(fs.existsSync("nodeInsert.js")) {
    fs.unlinkSync("nodeInsert.js");
  }
  fs.appendFileSync("nodeInsert.js","var bulk=db.nodes.initializeUnorderedBulkOp();\n");

  _.each(nodeMap, function(node){
    fs.appendFileSync("nodeInsert.js",
      "bulk.insert(" +
      JSON.stringify(
        {
          pkey: node.pkey,
          members: node.members,
          games: node.games,
          kills: node.kills,
          participants: node.participants
        }) + ");\n");
  });
  fs.appendFileSync("nodeInsert.js","bulk.execute();");
}

function genEdgeFile(edgeMap){

  if(fs.existsSync("edgeInsert.js")) {
    fs.unlinkSync("edgeInsert.js");
  }
  fs.appendFileSync("edgeInsert.js","var bulk=db.edges.initializeUnorderedBulkOp();\n");

  _.each(edgeMap, function(edge, key){
    _.each(edgeMap[key], function(value, to){
      fs.appendFileSync("edgeInsert.js",
        "bulk.insert(" +
        JSON.stringify({
          edgeId: key + ':' + to,
          from: key,
          to: to,
          weight: value
        }) + ");\n");
    });
  });
  fs.appendFileSync("edgeInsert.js","bulk.execute();");
}
