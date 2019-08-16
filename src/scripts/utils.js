//from https://stackoverflow.com/a/1527820/
let randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
//from https://stackoverflow.com/a/12646864/7941251
function shuffle(array) {
	//in place
	array;
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}
//adapted from https://davidwalsh.name/essential-javascript-functions
function debounce(func, wait, immediate) {
	let timeout;
	return function() {
		let context = this,
			args = arguments;
		let later = function() {
			timeout = null;
			if (!immediate) {
				func.apply(context, args);
			}
		};
		let callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) {
			func.apply(context, args);
		}
	};
}
export { randInt, shuffle, debounce };
