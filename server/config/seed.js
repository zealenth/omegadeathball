/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var Node = require('../api/node/node.model');
var Edge = require('../api/edge/edge.model');
var Parser = require('../api/parse.controller');

var _ = require('underscore');
var fs = require('fs');

var dir = './server/api/matches';

Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

Node.find({}).remove(function() {
  Edge.find({}).remove(function() {
    //populateDB()
    fs.readdir(dir, function(err, data){
      if (err) {
        console.log(err);
        console.log(process.cwd());
      }
      var nodeMap = {};
      var edgeMap = {};

      _.each(data, function(name) {
        var contents;
        try {
          contents = fs.readFileSync(dir + '/' + name);
          Parser.processMatch(contents, nodeMap, edgeMap);

          stuffServer(nodeMap, edgeMap);
          nodeMap = {};
          edgeMap = {};
        } catch (e) {
          console.log(e);
        }
      });
    });
    console.log("\tRogue edges gone!");
  });
});


function stuffServer(nodeMap, edgeMap){
  _.each(nodeMap, function(node){
    //var instance = new Node();
    //instance.pkey = node.pkey;
    //instance.members = node.members;
    //instance.games = node.games;
    //instance.kills = node.kills;
    //instance.participants = node.participants;
    //instance.save(function (err) {});

    Node.findOneAndUpdate({
      pkey: node.pkey,
      members: node.members,
      games: node.games,
      kills: node.kills,
      participants: node.participants
    }, {upsert:true}, function(err){
      if (err) console.log( err );
      console.log("succesfully saved");
    });
  });

  _.each(edgeMap, function(edge, key){
    _.each(edgeMap[key], function(value, to){
      Edge.create({
        edgeId: key + ':' + to,
        from: key,
        to: to,
        weight: value
      });
    });
  });
}

//edgeId: String,
//from: String,
//to: String,
//weight: Number

function populateDB(){
  Node.create({
    pkey: '92',
    members: [ 92 ],
    games: 1,
    kills: 2,
    participants: 2
  });

  Edge.create({
    edgeId: '92:92-181',
    from: '92',
    to: '92-181',
    weight: 2
  }, {
    edgeId: '92:92-81',
    from: '92',
    to: '92-81',
    weight: 55
  });
}
