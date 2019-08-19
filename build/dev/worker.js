//from https://stackoverflow.com/a/1527820/
let randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min; //from https://stackoverflow.com/a/12646864/7941251


function shuffle(array) {

  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
} //adapted from https://davidwalsh.name/essential-javascript-functions

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
  }

  performAction(message) {
    return this.bot.performAction(message);
  }

  sendMessage(x, y, surrondings) {
    return this.bot.sendMessage(x, y, surrondings);
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

/*eslint no-unused-vars:0*/
class ControllerBot {
  constructor(locations) {
    this.storage = "";
  }

  sendMessage(messages, index) {
    return "";
  }

}

const STARTING_COINS = 100;
const COINS_PER_ROUND = 10;
const NUM_WORKER_BOTS = 20;
class Controller {
  constructor(botClasses, displayFunc) {
    this.displayFunc = displayFunc;
    this.botClasses = botClasses.filter(botClasses2 => botClasses2.controllerBot.prototype instanceof ControllerBot && botClasses2.workerBot.prototype instanceof WorkerBot);
  }

  runGame() {
    this.initGrid();
    shuffle(this.botnets);
    this.botnets = this.botnets.slice(0, 15);

    for (let i = 0; i < 1; i++) {
      this.runRound(i);
    }

    return this.botnets.sort((a, b) => a.gold - b.gold).map((botnet, i) => "".concat(i + 1, ". ").concat(botnet.name, ":").concat(botnet.workerBots.reduce((a, b) => a.gold + b.gold, 0), " Gold")).join("\n");
  }

  runRound(round) {
    console.log(round);

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

        if (workerBot.stunnedRound === undefined || workerBot.stunnedRound === round - 1) {
          workerBot.stunnedRound = undefined;
          let allMessages = workerBots.map(workerBot2 => workerBot2.sendMessage(workerBot2.x, workerBot2.y, this.getSurroundings(workerBot2.x, workerBot2.y)));
          let controllerBotMessage = botnet.controllerBot.sendMessage(allMessages, i);
          let action = workerBot.performAction(controllerBotMessage);

          if (!this.handleAction(action, workerBot)) {
            console.log("".concat(workerBot.name, " made an invalid action(").concat(action, ")"));
          }
        } else {
          //emp'd
          console.log("".concat(workerBot.name, " was EMP'd"));
        }
      }
    }

    this.display();
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
        if ([6, 7, 8, 11, 12, 13, 16, 17, 18].includes(action[1])) {
          let coords = this.surroundingsIndexToCoords(action[1], bot.x, bot.y);
          let square = this.grid[coords[1]][coords[0]];

          if (square instanceof WorkerBotWrapper) {
            let gold = Math.floor(square.gold);
            console.log("".concat(bot.name, " killed ").concat(square.name, " for ").concat(gold, " gold"));
            bot.gold += gold;
            square = "";
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }

      case "move":
        if ([6, 7, 8, 11, 13, 16, 17, 18].includes(action[1])) {
          let coords = this.surroundingsIndexToCoords(action[1], bot.x, bot.y);
          let square = this.grid[coords[1]][coords[0]];

          if (square === "" || square === "C") {
            this.grid[bot.y][bot.x] = "";
            square = bot;
            [bot.x, bot.y] = coords;
            return true;
          } else {
            return false;
          }
        } else if (action[1] === 12) {
          return true;
        } else {
          return false;
        }

      case "emp":
        throw new TypeError("emp not implemented");

      default:
        console.log("".concat(bot.name, " skipped its turn"));
    }
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
    return [index % 5 - 2 + x, Math.floor(index / 5) - 2 + y];
  }

  display() {
    this.displayFunc(this.grid.map(row => row.map(square => square instanceof WorkerBotWrapper ? ["B", square.color] : square)));
  }

}

let eval2 = eval;

onmessage = function onmessage(event) {
  let botClasses = event.data.map(func => eval2("(".concat(func, ")()")));
  let controller = new Controller(botClasses, postMessage.bind(this));
  controller.runGame();
};
//# sourceMappingURL=worker.js.map
