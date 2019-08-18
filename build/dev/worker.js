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

class WorkerBot {
  constructor(index) {
    this.index = index;
    this.color = "";
  }

  performAction(message) {}

  sendMessage(x, y, surrondings) {}

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
    console.log(this.grid);
    shuffle(this.botnets);
    this.botnets = this.botnets.slice(0, 15);

    for (let i = 0; i < 1000; i++) {
      this.runRound(i);
    }

    return this.botnets.sort((a, b) => a.gold - b.gold).map((botnet, i) => "".concat(i + 1, ". ").concat(botnet.name, ":").concat(botnet.workerBots.reduce((a, b) => a.gold + b.gold, 0), " Gold")).join("\n");
  }

  runRound(round) {
    console.log(round);

    for (let i = 0; i < COINS_PER_ROUND; i++) {
      this.generateCoin();
    }

    shuffle(this.botnets);
    let workerBots = this.botnets.flatMap(botnet => botnet.workerBots);

    for (let botnet of this.botnets) {
      for (let i = 0; i < botnet.workerBots.length; i++) {
        let workerBot = botnet.workerBots[i];

        if (workerBot.stunnedRound !== -1 || workerBot.stunnedRound === round - 1) {
          workerBot.stunnedRound = -1;
          let allMessages = workerBots.map(workerBot2 => workerBot2.sendMessage(workerBot2.x, workerBot2.y, this.getSurrondings(workerBot2.x, workerBot2.y)));
          let controllerBotMessage = botnet.controllerBot.sendMessage(allMessages, i);
          let action = workerBot.performAction(controllerBotMessage);

          if (!this.handleAction(action, workerBot)) {
            console.log("Invalid Action(".concat(action, ")"));
          }
        } else {
          //emp'd
          console.log("EMP'd");
        }
      }
    }

    this.display();
  }

  initGrid() {
    this.grid = new Array(100); //indexed [y,x]

    for (let i = 0; i < 100; i++) {
      this.grid[i] = new Array(100).fill(undefined);
    }

    this.botnets = this.botClasses.map(botClasses2 => {
      let workerBots = [];

      for (let i = 0; i < NUM_WORKER_BOTS; i++) {
        workerBots.push(this.generateWorkerBot(i, botClasses2.name, botClasses2.workerBot));
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
          //is valid attack spot
          let coords = this.surrondingsIndexToCoords(action[1]);
          let square = this.grid[coords[1]][coords[0]];

          if (square instanceof WorkerBotWrapper) {
            let gold = Math.floor(square.gold);
            console.log("".concat(bot.name, " killed ").concat(square.name, " for ").concat(gold, " gold"));
            bot.gold += gold;
            square = undefined;
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }

      case "move":
        if (action[1] >= 0 && action[1] <= 24) {
          let coords = this.surrondingsIndexToCoords(action[1]);
          let square = this.grid[coords[1]][coords[0]];

          if (square === undefined) {
            this.grid[bot.y][bot.x] = undefined;
            square = bot;
            [bot.x, bot.y] = coords;
            return true;
          } else {
            return false;
          }
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

    if (this.grid[y][x] === undefined) {
      this.grid[y][x] = "C";
    } else {
      this.generateCoin();
    }
  }

  generateWorkerBot(index, name, workerBotClass) {
    let x = randInt(0, 99);
    let y = randInt(0, 99);

    if (this.grid[y][x] === undefined) {
      let bot = new WorkerBotWrapper(x, y, index, name, workerBotClass);
      this.grid[y][x] = bot;
      return bot;
    } else {
      return this.generateWorkerBot(index, name, workerBotClass);
    }
  }

  getSurrondings(x, y) {
    let surrondings = [];

    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        surrondings.push(this.grid[y + i][x + j]);
      }
    }

    return surrondings.map(square => square instanceof WorkerBotWrapper ? "B" : square);
  }

  surrondingsIndexToCoords(index, x, y) {
    //returns as x,y
    return [index % 5 - 2 + x, Math.floor(index / 5) - 2 + y];
  }

  display() {
    this.displayFunc(this.grid);
  }

}

let eval2 = eval;

onmessage = function onmessage(event) {
  console.log(event);
  let botClasses = event.data.map(func => eval2("(".concat(func, ")()")));
  let controller = new Controller(botClasses, postMessage);
  controller.runGame();
};
//# sourceMappingURL=worker.js.map
