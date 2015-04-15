//returns combination of a key
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
