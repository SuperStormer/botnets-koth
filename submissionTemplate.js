/* eslint constructor-super:0,no-this-before-super:0,no-unused-vars:0*/
import ControllerBot from "./src/scripts/ControllerBot.js";
import WorkerBot from "./src/scripts/WorkerBot.js";

//copy the part below
function yourBotnet() {
  class YourControllerBot extends ControllerBot {
    constructor(locations) {
      this.name = "";
      this.storage = "";
    }
    sendMessage(messages, index) {
      return [];
    }
  }
  class YourWorkerBot extends WorkerBot {
    constructor(x, y) {
      this.storageSize = 0;
      this.storage = "";
      this.color = "";
    }
    performAction(surrondings, message) {}
    sendMessage(surrondings) {}
  }
  return { controllerBot: YourControllerBot, workerBot: YourWorkerBot };
}
