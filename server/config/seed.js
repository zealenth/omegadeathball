/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var Node = require('../api/node/node.model');
var Edge = require('../api/edge/edge.model');


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
  Node.create({
    pkey: '92',
    members: [ 92 ],
    games: 1,
    kills: 2,
    participants: 2
  });
});

//edgeId: String,
//from: String,
//to: String,
//weight: Number
Edge.find({}).remove(function() {
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
});

