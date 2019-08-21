import Controller from "./Controller.js";
let eval2 = eval;
onmessage = function(event) {
	let botClasses = event.data.botClasses.map(func => eval2(`(${func})()`));
	let controller = new Controller(
		botClasses,
		grid => {
			postMessage(["update", grid]);
		},
		event.data.rounds
	);
	postMessage(["end", controller.runGame()]);
};
