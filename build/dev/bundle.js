(function () {
	'use strict';

	/*eslint no-unused-vars:0*/
	class ControllerBot {
	  constructor(locations) {
	    this.storage = "";
	  }

	  sendMessage(messages, index) {
	    return "";
	  }

	}

	/*eslint no-unused-vars:0*/
	class WorkerBot {
	  constructor(index) {
	    this.index = index;
	  }

	  performAction(message) {}

	  sendMessage(x, y, surroundings) {}

	}

	/* eslint constructor-super:0,no-this-before-super:0,no-unused-vars:0*/
	function sampleBotnet() {
	  class SampleControllerBot extends ControllerBot {
	    constructor(locations) {
	      super(locations);
	      this.storage = "";
	    }

	    sendMessage(messages, index) {
	      let surrondings = messages.find(message => message[0] === index)[1];
	      let otherBot = surrondings.findIndex((square, i) => square === "B" && [6, 7, 8, 11, 13, 16, 17, 18].includes(i));

	      if (otherBot !== -1) {
	        return ["kill", otherBot];
	      }

	      let coin = surrondings.findIndex((square, i) => square === "C" && [6, 7, 8, 11, 13, 16, 17, 18].includes(i));

	      if (coin !== -1) {
	        return ["move", coin];
	      }

	      let validMoves = [6, 7, 8, 11, 13, 16, 17, 18].filter(x => surrondings[x] === "");
	      return ["move", validMoves[Math.floor(Math.random() * validMoves.length)]];
	    }

	  }

	  class SampleWorkerBot extends WorkerBot {
	    performAction(message) {
	      return message;
	    }

	    sendMessage(x, y, surroundings) {
	      return [this.index, surroundings];
	    }

	  }

	  return {
	    name: "SampleBotnet",
	    color: "red",
	    controllerBot: SampleControllerBot,
	    workerBot: SampleWorkerBot
	  };
	}

	//from https://stackoverflow.com/a/1527820/


	function debounce(func, wait, immediate) {
	  let timeout;
	  return function () {
	    let context = this,
	        args = arguments;

	    let later = function later() {
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

	let canvas = document.getElementById("grid");
	const CANVAS_SIZE = canvas.width;
	const SQUARE_SIZE = CANVAS_SIZE / 100;
	let context = canvas.getContext("2d");
	let botClasses = [sampleBotnet.toString()];
	let displayInterval = 100;
	let rounds = 10;

	if (window.Worker) {
	  let worker = new Worker("./worker.js");
	  worker.postMessage({
	    botClasses,
	    rounds
	  });
	  worker.onmessage = debounce(function (event) {
	    let grid = event.data;
	    context.clearRect(0, 0, canvas.width, canvas.height);

	    for (let i = 0; i < 100; i++) {
	      for (let j = 0; j < 100; j++) {
	        let square = grid[i][j];
	        let dimensions = [i * SQUARE_SIZE, j * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE];

	        if (square !== "") {
	          if (square === "C") {
	            //coin
	            context.fillStyle = "rgb(255,255,0)";
	          } else if (square[0] === "B") {
	            context.fillStyle = square[1];
	          } else {
	            console.error("Invalid Square:".concat(square));
	          }

	          context.fillRect(...dimensions);
	        } else {
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

}());
//# sourceMappingURL=bundle.js.map
