var _ = require('underscore');

//returns first level combination of a key
//assuming key object is sorted
//assuming key object is an array []
exports.combination = function(entry){
	var rv = [];
	var n = entry.length - 1;
	if(n > 0){
		while(n >= 0){
			var currentCombination = [];
			for(var i = 0; i < entry.length; i++){
				if(i !== n){
					currentCombination.push(entry[i]);
				}
			}
			rv.push(currentCombination);
			n--;
		}
	}
	return rv;
}

//returns combination all combinations of entry
//assuming key object is sorted
//assuming key object is an array []
//assuming vessel is an object {}
//assuming links is an array []
exports.traverseCombiantion = function(entry, vessel, links){
  if(entry.length == 0){
    return;
  }
  //console.log(entry);
  var results = exports.combination(entry);
  var rv = [];
  _.each(results, function(value){
    links.push([value, entry]);
    vessel[value] = 0;
    var next = exports.traverseCombiantion(value, vessel, links);
    rv.push(next);
  });
  return rv;
}
