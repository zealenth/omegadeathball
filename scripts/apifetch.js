var request = require('request');
var rateLimit = require('rate-limit');
var _ = require('underscore');
var fs = require('fs');

var url = "";
var base = "https://na.api.pvp.net";

var urfPoint = "/api/lol/na/v4.1/game/ids?beginDate=";//+beginDate
var matchPoint = "/api/lol/na/v2.2/match/"; //+matchID
var beginDate = parseInt(fs.readFileSync('/home/code/projects/metaball/time.txt', {encoding: 'utf8'})); //1427936400
var includeTimeline = "?includeTimeline=true";
var apiKey = "&api_key=" + '';

url = base + urfPoint + beginDate + apiKey;
request(url, function (error, response, body) {
	console.log(url);
	var list = JSON.parse(body);
	beginDate += 300
	fs.writeFileSync('/home/code/projects/metaball/time.txt', beginDate, {encoding: 'utf8'});
	console.log(beginDate);
    fs.appendFile('/home/code/projects/metaball/matches.json', body, function (err) {
        if (err) return console.log(err);
        console.log('expect: ' + list.length);
	console.log(new Date());
    });

	if(list.length > 175){
		list =  list.slice(0, 175);
	}
	processList(list);
});

function processList(list){
	var queue = rateLimit.createQueue({interval: 1500});
	_.each(list, function(id){
	  //getMatch(id);
	  queue.add(function(){getMatch(id)});
	});
}

function getMatch(id){
	url = base + matchPoint + id + includeTimeline + apiKey;

	request(url, function (error, response, body) {
		fs.writeFile('/home/code/projects/metaball/matches/' + id + '.json', body, function (err) {
		    if (err) return console.log(err);
		    if (!error && response.statusCode != 200) {
		    	console.log(id + ' match has potential error ' + response.statusCode);
		    }
		});
	});
}

