import Controller from "./Controller.js";
let eval2 = eval;
onmessage = function(event) {
	console.log(event);
	let botClasses = event.data.map(func => eval2(`(${func})()`));
	let controller = new Controller(botClasses, postMessage);
	controller.runGame();
};
