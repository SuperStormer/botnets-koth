/*eslint no-unused-vars:0*/
class WorkerBot {
	constructor(index) {
		this.index = index;
	}
	performAction(message) {}
	sendMessage(x, y, surroundings) {}
}
/*let oldHasInstance = WorkerBot[Symbol.hasInstance].bind({});
Object.defineProperty(WorkerBot, Symbol.hasInstance, {
	value: function(instance) {
		return instance instanceof WorkerBotWrapper || oldHasInstance;
	}
});*/
export default WorkerBot;
