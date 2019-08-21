import sampleBotnet from "./sampleBotnet.js";
let canvas = document.getElementById("grid");
const CANVAS_SIZE = canvas.width;
const SQUARE_SIZE = CANVAS_SIZE / 100;
let context = canvas.getContext("2d");
let gridlines = true;
let botClasses = [sampleBotnet.toString()];
let rounds = 1000;
let counter = document.getElementById("round-counter");
let worker = undefined;
function displayGrid(grid) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	counter.textContent = parseInt(counter.textContent, 10) + 1;
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
function displayResults(results) {
	let rankings = document.getElementById("rankings");
	rankings.innerHTML = "";
	for (let row of results) {
		let ranking = document.createElement("li");
		ranking.append(`${row[0]}: ${row[1]} Gold`);
		rankings.append(ranking);
	}
	console.log(results);
}
function endWorker() {
	worker.terminate();
	delete window.worker;
}
if (window.Worker) {
	document
		.getElementById("run-game")
		.addEventListener("click", function(event) {
			event.preventDefault();
			counter.textContent = "0";
			let displayInterval = parseInt(
				document.getElementById("display-interval").value,
				10
			);
			let testBotnet = document.getElementById("test-botnet").value;
			let allBotClasses;
			if (testBotnet.length > 0) {
				allBotClasses = botClasses.concat(testBotnet);
			} else {
				allBotClasses = botClasses;
			}
			if (worker) {
				endWorker();
			}
			worker = new Worker("./worker.js");
			worker.postMessage({
				botClasses: allBotClasses,
				rounds,
				displayInterval
			});
			worker.onmessage = function(event) {
				if (event.data[0] === "update") {
					let grid = event.data[1];
					displayGrid(grid);
				} else if (event.data[0] === "end") {
					displayResults(event.data[1]);
					endWorker();
				}
			};
		});
	document.getElementById("stop-game").addEventListener("click", endWorker);
} else {
	console.error("Worker API Unsupported. Please use another browser");
}
