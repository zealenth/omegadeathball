var _ = require('underscore');
var fs = require('fs');
var combinations = require('./combination').combination;
var dir = './single';

function Node(){
  this.pkey;
  this.members = [];
  this.games = 0;
  this.kills = 0;
  this.avg = 0;
  this.participants = 0;

  return this;
}

function nodeAvg(node){
  return (node.games > 0 ? node.kills / node.games : 0);
}

function sortNumber(a,b) {
  return a - b;
}

fs.readdir(dir, function(err, data){
  if (err) {
    console.log(err);
  }
  var nodeMap = {};
  var edgeMap = {};
  var championMap = {};
  _.each(data, function(name) {
    var contents;
    try {
      contents = fs.readFileSync(dir + '/' + name);
      processMatch(contents, championMap, nodeMap, edgeMap);
    } catch (e) {
      console.log(e);
    }
  });
  //gephiStuff(championMap);
  gephiNodeStuff(nodeMap, edgeMap);
});

function processMatch(body, championMap, nodeMap, edgeMap) {
  var obj = JSON.parse(body);
  var playerMap = {};

  _.each(obj.participants, function(player) {
    playerMap[player.participantId] = player.championId;
  });

  //for each entry in timeline
  var nodeUpdateMap = {};
  _.each(obj.timeline.frames, function(timeslice) {
    //for each event
    _.each(timeslice.events, function(detail){
      if(detail.eventType === 'CHAMPION_KILL'){
        var key = "";
        var groupKey = [];
        //don't care about neutral monsters or unknown events?
        if(detail.killerId == 0)
          return;

        groupKey.push(playerMap[detail.killerId]);
        //map assistingparticipants
        _.each(detail.assistingParticipantIds, function(assistants){
          groupKey.push(playerMap[assistants]);
        });
        //sort key to maintain consistency;
        console.log(groupKey);
        groupKey.sort(sortNumber);
        console.log("post");
        console.log(groupKey);
        _.each(groupKey, function(id){
          key += id + "-";
        });
        key = key.slice(0,-1);

        //so this is wrong
        //create nodes for children

        if(typeof nodeMap[key] === 'undefined'){
          //create a new node
          nodeMap[key] = new Node();
          nodeMap[key].pkey = key;
          nodeMap[key].members.push(playerMap[detail.killerId]);

          _.each(detail.assistingParticipantIds, function(assistants){
            nodeMap[key].members.push(playerMap[assistants]);
          });

          nodeMap[key].participants = nodeMap[key].members.length;
          nodeMap[key].kills = 1;
          nodeMap[key].games = 1;
          nodeUpdateMap[key] = 0;
        }
        else{
          //update old node
          nodeMap[key].kills++;
          if(typeof nodeUpdateMap[key] === 'undefined'){
            nodeMap[key].games++;
            nodeUpdateMap[key] = 0;
          }
        }

        if (typeof championMap[key] !== 'undefined') {
          championMap[key]++;
        }
        else {
          championMap[key] = 1;
        }
        addChildren(groupKey, key);
      }
    });
  });

  function addChildren( groupKey, key ) {
    var children = combinations(groupKey);
    var childKey = "";

    _.each(children, function(child){
      //add nodes if they dont exist
      childKey = "";
      _.each(child, function(id){
        childKey += id + "-";
      });
      childKey = childKey.slice(0,-1);

      if(typeof nodeMap[childKey] === 'undefined'){
        nodeMap[childKey] = new Node();
        nodeMap[childKey].pkey = childKey;
        nodeMap[childKey].members = child;
        nodeMap[childKey].participants = child.length;
      }

      addEdge(childKey,key, nodeAvg(nodeMap[key]));
    });
  }

  function addEdge(from, to, weight){
    if(typeof edgeMap[from] === 'undefined'){
      edgeMap[from] = {};
    }
    edgeMap[from][to] = weight;
  }
}

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
      console.log(key + "," + nodeMap[key].kills + "," + nodeMap[key].participants
      + "," + nodeMap[key].games + "," + Math.round((nodeMap[key].kills / nodeMap[key].games) * 1000)/1000);
    }
  });
  console.log("edgedef>node1 VARCHAR,node2 VARCHAR,weight DOUBLE");
  console.log(edgeMap);
  _.each(edgeMap, function(edge, key){
    console.log(edge);
    _.each(edgeMap[key], function(value, to){
      console.log(key + "," + to + "," + value);
    });
  });
}
