(function () {
	'use strict';

	/*eslint no-unused-vars:0*/
	class WorkerBotWrapper {
	  constructor(x, y, index, name, botClass) {
	    this.x = x;
	    this.y = y;
	    this.gold = 0;
	    this.bot = new botClass(x, y, index);
	    this.name = "".concat(name, "#").concat(index);
	    this.stunnedRound = -1;
	  }

	  performAction(message) {
	    return this.bot.performAction(message);
	  }

	  sendMessage(surrondings) {
	    return this.bot.sendMessage(surrondings);
	  }

	}

	/*eslint no-unused-vars:0*/
	class ControllerBot {
	  constructor(locations) {
	    this.storage = "";
	  }

	  sendMessage(messages, index) {
	    return [];
	  }

	}

	/*eslint no-unused-vars:0*/

	class WorkerBot {
	  constructor(index) {
	    this.index = index;
	    this.color = "";
	  }

	  performAction(message) {}

	  sendMessage(x, y, surrondings) {}

	}

	/* eslint constructor-super:0,no-this-before-super:0,no-unused-vars:0*/
	function sampleBotnet() {
	  class SampleControllerBot extends ControllerBot {
	    constructor(locations) {
	      super(locations);
	      this.name = "";
	      this.storage = "";
	    }

	    sendMessage(messages, index) {
	      console.log(messages);
	      let surrondings = messages.find(message => message[0] === index)[1];
	      let otherBot = surrondings.find(square => square === "B");

	      if (otherBot !== undefined) {
	        return ["attack", otherBot];
	      }

	      let coin = surrondings.find(square => square === "C");
	      return ["move", coin];
	    }

	  }

	  class SampleWorkerBot extends WorkerBot {
	    constructor(index) {
	      super(index);
	      this.color = "red";
	    }

	    performAction(message) {
	      if (message[0] === "attack") {
	        return ["attack", message[0]];
	      }

	      if (message[1] !== undefined) {
	        return ["move", message];
	      } else {
	        return false;
	      }
	    }

	    sendMessage(x, y, surrondings) {
	      return [this.index, surrondings];
	    }

	  }

	  return {
	    name: "SampleBotnet",
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

	if (window.Worker) {
	  let worker = new Worker("./worker.js");
	  worker.postMessage(botClasses);
	  worker.onmessage = debounce(function (grid) {
	    console.log(grid);

	    for (let i = 0; i < 100; i++) {
	      for (let j = 0; j < 100; j++) {
	        let square = grid[i][j];
	        let dimensions = [i * SQUARE_SIZE, j * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE];

	        if (square !== undefined) {
	          if (square === "C") {
	            //coin
	            context.fillstyle = "rgb(255,255,0)";
	          } else if (square instanceof WorkerBotWrapper) {
	            context.fillstyle = square.color;
	          }

	          context.fillRect(...dimensions);
	        } else {
	          context.lineWidth = 0.3;
	          context.strokestyle = "rgb(20,20,20)";
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
