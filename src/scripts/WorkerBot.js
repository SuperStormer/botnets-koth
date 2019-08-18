import WorkerBotWrapper from "./WorkerBotWrapper.js";

/*eslint no-unused-vars:0*/
class WorkerBot {
	constructor(index) {
		this.index = index;
		this.color = "";
	}
	performAction(message) {}
	sendMessage(x, y, surrondings) {}
}
/*let oldHasInstance = WorkerBot[Symbol.hasInstance].bind({});
Object.defineProperty(WorkerBot, Symbol.hasInstance, {
	value: function(instance) {
		return instance instanceof WorkerBotWrapper || oldHasInstance;
	}
});*/
export default WorkerBot;
