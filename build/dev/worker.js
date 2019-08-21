//from https://stackoverflow.com/a/1527820/
let randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min; //from https://stackoverflow.com/a/12646864/7941251


function shuffle(array) {

  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function sleep(timeout) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    setTimeout(resolve, timeout);
  });
}

/*eslint no-unused-vars:0*/
class WorkerBot {
  constructor(index) {
    this.index = index;
  }

  performAction(message) {}

  sendMessage(x, y, surroundings) {}

}

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
class WorkerBotWrapper {
  constructor(x, y, index, name, color, botClass) {
    this.x = x;
    this.y = y;
    this.index = index;
    this.gold = 0;
    this.color = color;
    this.bot = new botClass(index);
    this.name = "".concat(name, "#").concat(index);
    this.stunnedRound = undefined;
    this.alive = true;
  }

  performAction(message) {
    return this.bot.performAction(message);
  }

  sendMessage(x, y, surrondings) {
    return this.bot.sendMessage(x, y, surrondings);
  }

}

const STARTING_COINS = 100;
const COINS_PER_ROUND = 10;
const NUM_WORKER_BOTS = 20;
class Controller {
  constructor(botClasses, displayFunc) {
    let rounds = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
    let displayInterval = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;
    this.rounds = rounds;
    this.displayFunc = displayFunc;
    this.displayInterval = displayInterval;
    this.botClasses = botClasses.filter(botClasses2 => botClasses2.controllerBot.prototype instanceof ControllerBot && botClasses2.workerBot.prototype instanceof WorkerBot);
  }

  async runGame() {
    this.initGrid();
    shuffle(this.botnets);
    this.botnets = this.botnets.slice(0, 15);

    for (let i = 0; i < this.rounds; i++) {
      await this.runRound(i);
    }

    return this.botnets.sort((a, b) => a.gold - b.gold).map(botnet => [botnet.name, botnet.workerBots.reduce((a, b) => a + b.gold, 0)]);
  }

  async runRound(round) {
    console.log("Round #".concat(round));

    for (let i = 0; i < COINS_PER_ROUND; i++) {
      try {
        this.generateCoin();
      } catch (error) {
        console.warn("No free space for coins");
      }
    }

    shuffle(this.botnets);
    let workerBots = this.botnets.flatMap(botnet => botnet.workerBots);

    for (let botnet of this.botnets) {
      for (let i = 0; i < botnet.workerBots.length; i++) {
        let workerBot = botnet.workerBots[i];

        if (workerBot.alive) {
          if (workerBot.stunnedRound === undefined || workerBot.stunnedRound === round - 1) {
            workerBot.stunnedRound = undefined;
            let allMessages = workerBots.map(workerBot2 => workerBot2.sendMessage(workerBot2.x, workerBot2.y, this.getSurroundings(workerBot2.x, workerBot2.y)));
            let controllerBotMessage = botnet.controllerBot.sendMessage(allMessages, i);

            try {
              let action = workerBot.performAction(controllerBotMessage);

              if (!this.handleAction(action, workerBot)) {
                console.log("".concat(workerBot.name, " made an invalid action(").concat(action, ")"));
              }
            } catch (error) {
              console.error("".concat(workerBot.name, " threw this exception with this message: ").concat(controllerBotMessage));
              console.error(error.stack);
            }
          } else {
            //emp'd
            console.log("".concat(workerBot.name, " was EMP'd"));
          }
        }
      }
    }

    this.display();
    await sleep(this.displayInterval);
  }

  initGrid() {
    this.grid = new Array(100); //indexed [y,x]

    for (let i = 0; i < 100; i++) {
      this.grid[i] = new Array(100).fill("");
    }

    this.botnets = this.botClasses.map(botClasses2 => {
      let workerBots = [];

      for (let i = 0; i < NUM_WORKER_BOTS; i++) {
        workerBots.push(this.generateWorkerBot(i, botClasses2.name, botClasses2.color, botClasses2.workerBot));
      }

      let controllerBot = new botClasses2.controllerBot(workerBots.map(bot => [bot.x, bot.y]));
      return {
        name: botClasses2.name,
        controllerBot,
        workerBots
      };
    });

    for (let i = 0; i < STARTING_COINS; i++) {
      this.generateCoin();
    }
  }

  handleAction(action, bot) {
    //returns true if action was valid
    switch (action[0]) {
      case "kill":
        return this.handleKill(action[1], bot);

      case "move":
        return this.handleMove(action[1], bot);

      case "emp":
        throw new TypeError("emp not implemented");

      default:
        console.log("".concat(bot.name, " skipped its turn"));
    }
  }

  handleKill(param, bot) {
    if ([6, 7, 8, 11, 13, 16, 17, 18].includes(param)) {
      let coords = this.surroundingsIndexToCoords(param, bot.x, bot.y);
      let square;

      try {
        square = this.grid[coords[1]][coords[0]];
      } catch (error) {
        console.error("".concat(bot.name, " tried to kill an invalid location(").concat(coords, ")"));
      }

      if (square instanceof WorkerBotWrapper) {
        let gold = Math.floor(square.gold);
        console.log("".concat(bot.name, " killed ").concat(square.name, " for ").concat(gold, " gold"));
        bot.gold += gold;
        this.grid[coords[1]][coords[0]] = "";

        try {
          this.kill(coords[0], coords[1]);
        } catch (error) {
          console.error(coords);
          console.error(bot);
          console.error(square);
          console.error(this.botnets);
        }

        return true;
      } else {
        return false;
      }
    } else if (param === 12) {
      console.log("".concat(bot.name, " commited suicide"));
      this.kill(bot.x, bot.y);
      return true;
    } else {
      return false;
    }
  }

  handleMove(param, bot) {
    if ([6, 7, 8, 11, 13, 16, 17, 18].includes(param)) {
      let coords = this.surroundingsIndexToCoords(param, bot.x, bot.y);
      let square;

      try {
        square = this.grid[coords[1]][coords[0]];
      } catch (error) {
        console.error("".concat(bot.name, " tried to move to an invalid location(").concat(coords, ")"));
      }

      if (square === "" || square === "C") {
        if (square === "C") {
          bot.gold++;
        }

        this.grid[bot.y][bot.x] = "";
        this.grid[coords[1]][coords[0]] = bot;
        [bot.x, bot.y] = coords;
        return true;
      } else {
        return false;
      }
    } else if (param === 12) {
      return true;
    } else {
      return false;
    }
  }

  kill(x, y) {
    let bot = this.botnets.flatMap(botnet => botnet.workerBots).find(bot => bot.x === x && bot.y === y);
    bot.alive = false;
  }

  generateCoin() {
    let x = randInt(0, 99);
    let y = randInt(0, 99);

    if (this.grid[y][x] === "") {
      this.grid[y][x] = "C";
    } else {
      this.generateCoin();
    }
  }

  generateWorkerBot(index, name, color, workerBotClass) {
    let x = randInt(0, 99);
    let y = randInt(0, 99);

    if (this.grid[y][x] === "") {
      let bot = new WorkerBotWrapper(x, y, index, name, color, workerBotClass);
      this.grid[y][x] = bot;
      return bot;
    } else {
      return this.generateWorkerBot(index, name, color, workerBotClass);
    }
  }

  getSurroundings(x, y) {
    let surroundings = [];

    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        try {
          surroundings.push(this.grid[y + i][x + j]);
        } catch (error) {
          surroundings.push("E");
        }
      }
    }

    return surroundings.map(square => square instanceof WorkerBotWrapper ? "B" : square);
  }

  surroundingsIndexToCoords(index, x, y) {
    //returns as x,y

    /*console.log(
    	`indx:${index},x=${x},y=${y}, return=${[
    		(index % 5) - 2 + x,
    		Math.floor(index / 5) - 2 + y
    	]}`
    );*/
    return [index % 5 - 2 + x, Math.floor(index / 5) - 2 + y];
  }

  display() {
    this.displayFunc(this.grid.map(row => row.map(square => square instanceof WorkerBotWrapper ? ["B", square.color] : square)));
  }

}

let eval2 = eval;

onmessage = function onmessage(event) {
  let botClasses = event.data.botClasses.map(func => eval2("(".concat(func, ")()")));
  let controller = new Controller(botClasses, grid => {
    postMessage(["update", grid]);
  }, event.data.rounds, event.data.displayInterval);
  controller.runGame().then(results => {
    postMessage(["end", results]);
  });
};
//# sourceMappingURL=worker.js.map
