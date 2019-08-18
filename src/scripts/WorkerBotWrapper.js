/*eslint no-unused-vars:0*/
export default class WorkerBotWrapper {
	constructor(x, y, index, name, botClass) {
		this.x = x;
		this.y = y;
		this.gold = 0;
		this.bot = new botClass(x, y, index);
		this.name = `${name}#${index}`;
		this.stunnedRound = -1;
	}
	performAction(message) {
		return this.bot.performAction(message);
	}
	sendMessage(surrondings) {
		return this.bot.sendMessage(surrondings);
	}
}
