var _ = require('underscore');
var fs = require('fs');
 
var dir = './sample';
 
function Node(){
    this.pkey;
    this.members = [];
    this.games = 0;
    this.kills = 0;
    this.participants = 0;
    this.nodeLinks = [];
    this.currentEdge;
 
    return this;
}
 
function MyEdge(f,t,w){
    this.fromNode = f;
    this.toNode = t;
    this.weight = w;
 
    return this;
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
            processMatch(contents, championMap, nodeMap);
        } catch (e) {
            console.log(e);
        }
    });
    //gephiStuff(championMap);
    gephiNodeStuff(nodeMap);
});
 
function processMatch(body, championMap, nodeMap) {
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
            if(detail.eventType == 'CHAMPION_KILL'){
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
                groupKey.sort();
 
                _.each(groupKey, function(id){
                    key += id + "-";
                });
                key = key.slice(0,-1);
 
                if (typeof nodeUpdateMap[key] == "undefined") {
                    nodeUpdateMap[key] = 0;
                }

                //so this is wrong
                //create nodes for children
 
                if(typeof nodeMap[key] == "undefined"){
                    //create a new node
                    nodeMap[key] = new Node();
                    nodeMap[key].pkey = key;
                    nodeMap[key].members.push(playerMap[detail.killerId]);
 
                    _.each(detail.assistingParticipantIds, function(assistants){
                        nodeMap[key].members.push(playerMap[assistants]);
                        nodeMap[key].nodeLinks.push(new MyEdge(playerMap[assistants], key, 1));
                    });
 
                    //avoid self edges
                    if (nodeMap[key].members.length > 1)
                        nodeMap[key].nodeLinks.push(new MyEdge(playerMap[detail.killerId], key, 1));
 
                    nodeMap[key].games = 0;
                    nodeMap[key].kills = 1;
                    nodeMap[key].participants = nodeMap[key].members.length;
                }
                else{
                    //update old node
                    nodeMap[key].kills++;
                    _.each(nodeMap[key].nodeLinks, function(link){
                        link.weight++;
                    });
                }
 
                if (typeof championMap[key] != "undefined") {
                    championMap[key]++;
                }
                else {
                    championMap[key] = 1;
                }
            }
        });
    });
 
    _.each(nodeUpdateMap, function(value, key){
        nodeMap[key].games++;
    });
}
 
 
function gephiNodeStuff(nodeMap){
    console.log("nodedef>name VARCHAR,kills DOUBLE,participants DOUBLE,games DOUBLE, avg DOUBLE");
    var keys = [];
    _.each(nodeMap, function(stuff, key){
        keys.push(key);
    });
    keys.sort();
    _.each(keys, function(key){
        if(nodeMap[key].kills > 0 && nodeMap[key].games > 10) {
            console.log(key + "," + nodeMap[key].kills + "," + nodeMap[key].participants
            + "," + nodeMap[key].games + "," + Math.round((nodeMap[key].kills / nodeMap[key].games) * 1000)/1000);
        }
    });
    console.log("edgedef>node1 VARCHAR,node2 VARCHAR,weight DOUBLE");
    _.each(keys, function(key){
        if(nodeMap[key].kills > 0 && nodeMap[key].games > 10) {
            var maxw = -1;
            var str = '';
            _.each(nodeMap[key].nodeLinks, function(edge){
                if(edge.weight > maxw) {
                    str = edge.fromNode + "," + edge.toNode + "," + edge.weight;
                    maxw = edge.weight;
                }
            });
            if(str != '')
                console.log(str);
        }
    });
}
 
function gephiStuff(championMap){
    console.log("nodedef>name VARCHAR,value DOUBLE");
    var keys = [];
    _.each(championMap, function(stuff, key){
        keys.push(key);
    });
    keys.sort();
    _.each(keys, function(key){
        console.log(key + "," + championMap[key]);
    });
    console.log("edgedef>node1 VARCHAR,node2 VARCHAR");
    _.each(keys, function(key){
        var partials = key.split('-');
        _.each(keys, function(efficiency){
            if(key != efficiency){
                var others = efficiency.split('-');
                if(inefficiencyHelper(partials, others) == true){
                    console.log(key + ',' + efficiency);
                }
            }
        });
    });
}
 
function inefficiencyHelper(aList, bList) {
    if (aList.length + 1 != bList.length)
        return false;
 
 
    var contains = 0;
    _.each(aList, function (aPartials) {
        _.each(bList, function (bPartials) {
            if (aPartials == bPartials) {
                contains++;
            }
        });
    });
 
    return (contains == aList.length);
}