//test
//var rv = combination([1,2,3,4,5]);
//console.log(rv);
//rv = combination(rv[0]);
//console.log(rv);
//rv = combination(rv[0]);
//console.log(rv);
//rv = combination(rv[0]);
//console.log(rv);

//returns combination of a key
//assuming key object is sorted
//assuming key object is an array []
function combination(entry){
	var rv = [];
	var n = entry.length - 1;

	while(n >= 0){
		var currentCombination = [];
		for(var i = 0; i < entry.length; i++){
			if(i != n){
				currentCombination.push(entry[i]);
			}
		}
		rv.push(currentCombination);
		n--;
	}
	return rv;
}