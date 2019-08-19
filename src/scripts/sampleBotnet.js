/* eslint constructor-super:0,no-this-before-super:0,no-unused-vars:0*/
import ControllerBot from "./ControllerBot.js";
import WorkerBot from "./WorkerBot.js";

export default function sampleBotnet() {
	class SampleControllerBot extends ControllerBot {
		constructor(locations) {
			super(locations);
			this.storage = "";
		}
		sendMessage(messages, index) {
			console.log(messages);
			let surrondings = messages.find(message => message[0] === index)[1];
			let otherBot = surrondings.findIndex(
				(square, i) => square === "B" && i !== 12
			);
			if (otherBot !== -1) {
				return ["kill", otherBot];
			}
			let coin = surrondings.findIndex(square => square === "C");
			if (coin !== -1) {
				return ["move", coin];
			}
			return ["move", 12];
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
