import Controller from "./Controller.js";
let eval2 = eval;
onmessage = function(event) {
	let botClasses = event.data.botClasses.map(func => eval2(`(${func})()`));
	let controller = new Controller(
		botClasses,
		postMessage.bind(this),
		event.data.rounds
	);
	controller.runGame();
};
