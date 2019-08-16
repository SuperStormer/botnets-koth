function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

//from https://stackoverflow.com/a/1527820/
var randInt = function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function shuffle(array) {

  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

/*eslint no-unused-vars:0*/
var WorkerBot =
/*#__PURE__*/
function () {
  function WorkerBot(x, y) {
    _classCallCheck(this, WorkerBot);

    this.x = x;
    this.y = y;
    this.initialize(x, y);
  }

  _createClass(WorkerBot, [{
    key: "initialize",
    value: function initialize(x, y) {
      this.storageSize = 0;
      this.storage = "";
      this.color = "";
    }
  }, {
    key: "performAction",
    value: function performAction(surrondings, message) {}
  }, {
    key: "sendMessage",
    value: function sendMessage(surrondings) {}
  }]);

  return WorkerBot;
}();

/*eslint no-unused-vars:0*/
var ControllerBot =
/*#__PURE__*/
function () {
  function ControllerBot(locations) {
    _classCallCheck(this, ControllerBot);

    this.storage = "";
  }

  _createClass(ControllerBot, [{
    key: "sendMessage",
    value: function sendMessage(messages, index) {
      return [];
    }
  }]);

  return ControllerBot;
}();

var STARTING_COINS = 100;
var COINS_PER_ROUND = 10;
var NUM_WORKER_BOTS = 20;

var Controller =
/*#__PURE__*/
function () {
  function Controller(botClasses, displayFunc) {
    _classCallCheck(this, Controller);

    this.displayFunc = displayFunc;
    this.botClasses = botClasses.filter(function (botClasses2) {
      return botClasses2.controllerBot.prototype instanceof ControllerBot && botClasses2.workerBot.prototype instanceof WorkerBot;
    });
  }

  _createClass(Controller, [{
    key: "runGame",
    value: function runGame() {
      this.initGrid();
      shuffle(this.botnets);
      this.botnets = this.botnets.slice(0, 15);

      for (var i = 0; i < 1000; i++) {
        this.runRound(i);
      }
    }
  }, {
    key: "runRound",
    value: function runRound(round) {
      var _this = this;

      console.log(round);

      for (var i = 0; i < COINS_PER_ROUND; i++) {
        this.generateCoin();
      }

      shuffle(this.botnets);
      var workerBots = this.botnets.flatMap(function (botnet) {
        return botnet.workerBots;
      });
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.botnets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var botnet = _step.value;

          for (var _i = 0; _i < botnet.workerBots.length; _i++) {
            var workerBot = botnet.workerBots[_i];
            var allMessages = workerBots.map(function (workerBot2) {
              return workerBot2.sendMessage(_this.getSurrondings(workerBot2.x, workerBot2.y));
            });
            var controllerBotMessage = botnet.controllerBot.sendMessage(allMessages, _i);
            var action = workerBot.performAction(controllerBotMessage);
            this.handleAction(action);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "initGrid",
    value: function initGrid() {
      var _this2 = this;

      this.grid = new Array(100); //indexed [y,x]

      for (var i = 0; i < 100; i++) {
        this.grid[i] = new Array(100);
      }

      this.botnets = this.botClasses.map(function (botClasses2) {
        var workerBots = [];

        for (var _i2 = 0; _i2 < NUM_WORKER_BOTS; _i2++) {
          workerBots.push(_this2.generateWorkerBot(botClasses2.workerBot));
        }

        return {
          controllerBot: new botClasses2.controllerBot(workerBots.map(function (bot) {
            return [bot.x, bot.y];
          })),
          workerBots: workerBots
        };
      });

      for (var _i3 = 0; _i3 < STARTING_COINS; _i3++) {
        this.generateCoin();
      }
    }
  }, {
    key: "handleAction",
    value: function handleAction(action) {
      //returns true if action was valid
      switch (action[0]) {
        case "kill":
          if ([6, 7, 8, 11, 12, 13, 16, 17, 18].includes(action[1])) {
            //is valid attack spot
            var coords = this.surrondingsIndexToCoords(action[1]);
            var square = this.grid[coords[1]][coords[0]];

            if (square instanceof WorkerBot) {
              square = undefined;
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }

        case "move":
      }
    }
  }, {
    key: "generateCoin",
    value: function generateCoin() {
      var x = randInt(0, 99);
      var y = randInt(0, 99);

      if (this.grid[y][x] === undefined) {
        this.grid[y][x] = "C";
      } else {
        this.generateCoin();
      }
    }
  }, {
    key: "generateWorkerBot",
    value: function generateWorkerBot(workerBotClass) {
      var x = randInt(0, 99);
      var y = randInt(0, 99);

      if (this.grid[y][x] === undefined) {
        var bot = new workerBotClass(x, y);
        this.grid[y][x] = bot;
        return bot;
      } else {
        return this.generateWorkerBot();
      }
    }
  }, {
    key: "getSurrondings",
    value: function getSurrondings(x, y) {
      var surrondings = [];

      for (var i = -2; i <= 2; i++) {
        for (var j = -2; j <= 2; j++) {
          surrondings.push(this.grid[y + i][x + j]);
        }
      }

      return surrondings;
    }
  }, {
    key: "surrondingsIndexToCoords",
    value: function surrondingsIndexToCoords(index, x, y) {
      //returns as x,y
      return [index % 5 - 2 + x, Math.floor(index / 5) - 2 + y];
    }
  }, {
    key: "display",
    value: function display() {
      this.displayFunc(this.grid);
    }
  }]);

  return Controller;
}();

var canvas = document.getElementById("grid");
var CANVAS_SIZE = canvas.width;
var SQUARE_SIZE = CANVAS_SIZE / 100;
var context = canvas.getContext("2d");
var botClasses = [];
var controller = new Controller(botClasses, function (grid) {
  console.log(grid);

  for (var i = 0; i < 100; i++) {
    for (var j = 0; j < 100; j++) {
      var square = grid[i][j];
      var dimensions = [i * SQUARE_SIZE, j * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE];

      if (square !== undefined) {
        if (square === "C") {
          //coin
          context.fillstyle = "rgb(255,255,0)";
        } else if (square instanceof WorkerBot) {
          context.fillstyle = square.color;
        }

        context.fillRect.apply(context, dimensions);
      } else {
        context.lineWidth = 0.3;
        context.strokestyle = "rgb(20,20,20)";
        context.strokeRect.apply(context, dimensions);
      }
    }
  }
});
controller.runGame();
//# sourceMappingURL=bundle.js.map
