/* eslint constructor-super:0,no-this-before-super:0,no-unused-vars:0*/
import ControllerBot from "./ControllerBot.js";
import WorkerBot from "./WorkerBot.js";

export default function sampleBotnet() {
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
