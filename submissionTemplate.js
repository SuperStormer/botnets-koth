/* eslint constructor-super:0,no-this-before-super:0,no-unused-vars:0*/
import ControllerBot from "./src/scripts/ControllerBot.js";
import WorkerBot from "./src/scripts/WorkerBot.js";

//copy the part below
function yourBotnet() {
	class YourControllerBot extends ControllerBot {
		constructor(locations) {
			super(locations);
			this.storage = "";
		}
		sendMessage(messages, index) {
			return [];
		}
	}
	class YourWorkerBot extends WorkerBot {
		constructor(index) {
			super(index);
			this.color = "";
		}
		performAction(message) {}
		sendMessage(x, y, surrondings) {}
	}
	return {
		name: "YourBotnet",
		controllerBot: YourControllerBot,
		workerBot: YourWorkerBot
	};
}
