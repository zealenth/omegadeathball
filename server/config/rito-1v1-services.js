var mongoose = require('mongoose');
var express = require('express');

module.exports = function( app ) {

  /* DATABSE SETUP */
  var conn = mongoose.createConnection('mongodb://localhost/projects');

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () {
    console.log( 'Connected to MongoDB' );
  });

  var championSchema = new mongoose.Schema( {
    _id: Number,
    name: String,
    wins: Number,
    games: Number,
    kills: {},
    killedBy: {}
  } );



  var killLinkSchema = new mongoose.Schema( {
    _id: String,
    source: Number,
    target: Number,
    count: Number
  } );

  var Champion = conn.model( 'Champion', championSchema );
  var KillerLink = conn.model( 'KillLink', killLinkSchema );

  //RITO CHALLENGE
  app.get( '/urf', function( req, res ) {
    var nodes = [];
    Champion.find( {}, function(err, docs) {
      if( docs ) {
        nodes = docs;
      }
      var links = [];
      KillerLink.find( {}, function(err, docs2) {
        links = docs2;
        return res.send( { nodes: nodes, links: links } );
      } );
    } );
  } );

  app.get( '/urf/:id', function( req, res ) {
    var id = req.params.id;
    var champion;

    Champion.find( { _id: id }, function( err, docs ) {
      if( docs && docs.length ) {
        champion = docs[ 0 ];
      }
      KillerLink.find( { source: id }, function( err, docs ) {
        var kills;
        if( docs ) {
          kills = docs;
        }
        KillerLink.find( { target: id }, function( err, docs ) {
          var deaths;
          if( docs ) {
            deaths = docs;
          }
          res.send( { champions: champion, kills: kills, deaths: deaths } );
        } );
      } );

    } );
  } );
};
