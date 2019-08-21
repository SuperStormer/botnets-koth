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
			let surrondings = messages.find(message => message[0] === index)[1];
			let otherBot = surrondings.findIndex(
				(square, i) =>
					square === "B" && [6, 7, 8, 11, 13, 16, 17, 18].includes(i)
			);
			if (otherBot !== -1) {
				return ["kill", otherBot];
			}
			let coin = surrondings.findIndex(
				(square, i) =>
					square === "C" && [6, 7, 8, 11, 13, 16, 17, 18].includes(i)
			);
			if (coin !== -1) {
				return ["move", coin];
			}
			let validMoves = [6, 7, 8, 11, 13, 16, 17, 18].filter(
				x => surrondings[x] === ""
			);
			return [
				"move",
				validMoves[Math.floor(Math.random() * validMoves.length)]
			];
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
