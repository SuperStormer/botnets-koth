import sampleBotnet from "./sampleBotnet.js";
let canvas = document.getElementById("grid");
const CANVAS_SIZE = canvas.width;
const SQUARE_SIZE = CANVAS_SIZE / 100;
let context = canvas.getContext("2d");
let gridlines = true;
let botClasses = [sampleBotnet.toString()];
let displayInterval = 100;
let rounds = 1000;
let displayQueue = [];
let finishedGame = false;
let results;
function displayGrid(grid) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < 100; i++) {
		for (let j = 0; j < 100; j++) {
			let square = grid[i][j];
			let dimensions = [
				i * SQUARE_SIZE,
				j * SQUARE_SIZE,
				SQUARE_SIZE,
				SQUARE_SIZE
			];
			if (square !== "") {
				if (square === "C") {
					//coin
					context.fillStyle = "rgb(255,255,0)";
				} else if (square[0] === "B") {
					context.fillStyle = square[1];
				} else {
					console.error(`Invalid Square:${square}`);
				}
				context.fillRect(...dimensions);
			} else if (gridlines) {
				context.lineWidth = 0.3;
				context.strokeStyle = "rgb(20,20,20)";
				context.strokeRect(...dimensions);
			}
		}
	}
}
function displayResults() {
	console.log(results);
}
if (window.Worker) {
	let worker = new Worker("./worker.js");
	worker.postMessage({ botClasses, rounds });
	worker.onmessage = function(event) {
		if (event.data[0] === "update") {
			let grid = event.data[1];
			displayQueue.push(grid);
		} else if (event.data[0] === "end") {
			finishedGame = true;
			results = event.data[1];
		}
	};
	let interval = setInterval(() => {
		if (displayQueue.length == 0 && finishedGame) {
			clearInterval(interval);
			displayResults();
			worker.terminate();
			delete window.worker;
		} else if (displayQueue.length > 0) {
			displayGrid(displayQueue.shift());
		}
	}, displayInterval);
} else {
	console.error("Worker API Unsupported. Please use another browser");
}
