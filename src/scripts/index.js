import sampleBotnet from "./sampleBotnet.js";
import { debounce } from "./utils.js";
let canvas = document.getElementById("grid");
const CANVAS_SIZE = canvas.width;
const SQUARE_SIZE = CANVAS_SIZE / 100;
let context = canvas.getContext("2d");
let gridlines = true;
let botClasses = [sampleBotnet.toString()];
let displayInterval = 100;
if (window.Worker) {
	let worker = new Worker("./worker.js");
	worker.postMessage(botClasses);
	worker.onmessage = debounce(function(event) {
		let grid = event.data;
		console.log(grid);
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
						console.log(square[1]);
						context.fillStyle = square[1];
					} else {
						console.log(square);
					}
					context.fillRect(...dimensions);
				} else if (gridlines) {
					context.lineWidth = 0.3;
					context.strokeStyle = "rgb(20,20,20)";
					context.strokeRect(...dimensions);
				}
			}
		}
	}, displayInterval);
} else {
	console.error("Worker API Unsupported. Please use another browser");
}
