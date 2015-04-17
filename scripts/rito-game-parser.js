var request = require( 'request' );
var fs = require( 'fs' );
var _ = require( 'underscore' );

var mongoose = require('mongoose');

/* DATABSE SETUP */
mongoose.connect('mongodb://localhost/projects');

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

var Champion = mongoose.model( 'Champion', championSchema );
var KillerLink = mongoose.model( 'KillLink', killLinkSchema );


Champion.find( {} ).remove().exec();

KillerLink.find( {} ).remove().exec();

//poll rito servers every 5 minutes
setInterval( fetchGames, 5500 );

var seenGames = {};
var gameQueue = [];
var nextDate = 1427925300;

function fetchGames() {
  var url = 'https://na.api.pvp.net/api/lol/na/v4.1/game/ids?beginDate=' + nextDate + '&api_key=714e7824-dee1-49dd-87fc-37137d6ff708';
  nextDate += 300;
  request( url, function( error, resp, body ) {
    try {
      var games = JSON.parse( body );
      _.each( games, function( matchId ) {
        if ( !seenGames[ matchId ] ) {
          seenGames[ matchId ] = true;
          gameQueue.push( matchId );
          console.log( matchId );
        }
      } );
    }
    catch( e ) {
      console.log( 'parse error ' + e.description );
    }
  } );
}

//send a new api request every 2 seconds
setInterval( fetchMatchDetails, 2500 );
fetchGames();
function fetchMatchDetails() {
  if( !gameQueue.length )
    return;
  var matchUrl = 'https://na.api.pvp.net/api/lol/na/v2.2/match/' +
    gameQueue.shift() + '?includeTimeline=true&api_key=714e7824-dee1-49dd-87fc-37137d6ff708';
  request( matchUrl, function( error, resp, body ) {
    if( error ) {
      return;
    }
    try {
      var match = JSON.parse( body );
      if( !match || !match.timeline || !match.timeline.frames ) {
        return;
      }
      //console.log( match );
      var participantChampionMap = getParticipantMap( match );; //extract the participants;
      _.each( match.timeline.frames, function( frame ) {
        _.each( frame.events, function( event ) {
          //console.dir( event );
          if( event.eventType === 'CHAMPION_KILL' && !event.assistingParticipantIds ) {
            saveKiller( event, participantChampionMap );
            saveVictim( event, participantChampionMap );
            saveLink( event, participantChampionMap );
          }
        } );
      } );
      fs.writeFile( 'matches/' + match.matchId + '.js', JSON.stringify( match ) );
    }
    catch( e ) {
      console.log( 'parse error ' + e.description );
    }
  } );
}


function saveKiller( event, participantChampionMap ) {
  if( !event.killerId ) {
    return;
  }
  var killerChamp = participantChampionMap[ event.killerId ].championId;
  var victimChamp = participantChampionMap[ event.victimId ].championId;

  Champion.find( {_id: killerChamp }, function( err, docs ) {
    //console.dir( docs );
    var killer;
    if( docs && docs.length ) {
      if( _.isArray( docs ) ) {
        killer = docs[ 0 ];
      }
      else if( _.isObject( docs ) ) {
        killer = docs;

      }
      if( !killer.kills ) {
        killer.kills = {};
      }
      if( !killer.kills[ victimChamp ] ) {
        killer.kills[ victimChamp ] = [];
      }
      killer.kills[ victimChamp ].push( { time: event.timestamp } );
      killer.save();
    }
    else {
      killer = new Champion( { _id: killerChamp, kills: {}, killedBy: {}, games: 1, wins: ( participantChampionMap[ event.killerId ].winner ? 1  : 0 ) } );
      killer.kills[ victimChamp ] = [ { time: event.timestamp } ];
      killer.save();
    }
  } );
}

function saveVictim( event, participantChampionMap ) {
  //return true; //victim will be retrieved anyway?
  if( !event.killerId ) {
    return;
  }
  var killerChamp = participantChampionMap[ event.killerId ].championId;
  var victimChamp = participantChampionMap[ event.victimId ].championId;

  Champion.find( {_id: victimChamp }, function( err, docs ) {
    var victim;
    if( docs && docs.length ) {
      victim = docs[0];

      if( ! victim.killedBy )
        victim.killedBy = { };
      if( !victim.killedBy[ killerChamp ] )
        victim.killedBy[ killerChamp ] = [ {time: event.timestamp} ];
      else
        victim.killedBy[ killerChamp ].push(  );
    }
    else {
      victim = new Champion( { _id: victimChamp, killedBy: {}, kills: {}, wins: ( participantChampionMap[ event.killerId ].winner ? 1  : 0 ), games: 1 } );
      victim.killedBy[ killerChamp ] = [ { time: event.timestamp } ];
    }
    victim.save();
  } );
}

function saveLink( event, participantChampionMap ) {
  if(  !event.killerId  ) {
    return;
  }
  var killerChamp = participantChampionMap[ event.killerId ].championId;
  var victimChamp = participantChampionMap[ event.victimId ].championId;
  //var key = killerChamp > victimChamp ? killerChamp + ':' + victimChamp : victimChamp + ':' + killerChamp;
  KillerLink.find( {_id: killerChamp + ':' + victimChamp }, function( err, docs ) {
    var link;
    if( docs && docs.length ) {
      if( _.isArray( docs ) ) {
        link = docs[0];
      }
      else if( _.isObject( docs ) ) {
        link = docs;

      }
      link.count++;
    }
    else {
      link = new KillerLink( { _id: killerChamp + ':' + victimChamp, source: killerChamp, target: victimChamp, count: 1 } );
    }
    link.save();
  } );

  KillerLink.find( {_id: victimChamp + ':' + killerChamp }, function( err, docs ) {
    var link;
    if( docs && docs.length ) {
      if( _.isArray( docs ) ) {
        link = docs[0];
      }
      else if( _.isObject( docs ) ) {
        link = docs;

      }
      link.count--;
    }
    else {
      link = new KillerLink( { _id: victimChamp + ':' + killerChamp, source: victimChamp, target: killerChamp, count: -1 } );
    }
    link.save();
  } );
}

function getParticipantMap( match ) {
  var participantMap = {};
  _.each( match.participants, function( player ) {
    if( !player ) {
      return;
    }
    participantMap[ player.participantId ] = { championId: player.championId, winner: player.stats.winner };
    Champion.find( { _id: player.championId }, function( err, docs ) {
      var champ;
      if( docs && docs.length ) {
        champ = docs[ 0 ];
        if( player.stats.winner ) {
          champ.wins++;
        }
        champ.games = champ.games+1;
      }
      else {
        champ = new Champion( { _id: player.championId, wins: (player.stats.winner ? 1 : 0), games: 1, killedBy: [], kills: [] } );
      }
      champ.save();
    } )
  } );
  return participantMap;
}
