var _ = require('underscore');
var combinations = require('./combination').combination;

function Node(){
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

exports.processMatch = function(body, nodeMap, edgeMap) {
  var obj;
  if(body){
    try{
      obj = JSON.parse(body);
    }
    catch(e){
      throw e;
    }
  }
  else {
    return;
  }

  if(!obj.timeline.frames){
    throw "no frames... that's just dumb";
  }

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
        if(detail.killerId === 0)
          return;

        groupKey.push(playerMap[detail.killerId]);
        //map assistingparticipants
        _.each(detail.assistingParticipantIds, function(assistants){
          groupKey.push(playerMap[assistants]);
        });

        //sort key to maintain consistency;
        groupKey.sort(sortNumber);

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
