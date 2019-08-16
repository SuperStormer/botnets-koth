import Controller from "./Controller.js";
onmessage = function(event) {
	let botClasses = event[0];
	let controller = new Controller(botClasses, postMessage);
	controller.runGame();
};
