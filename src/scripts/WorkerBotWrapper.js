/*eslint no-unused-vars:0*/
export default class WorkerBotWrapper {
	constructor(x, y, botClass) {
		this.x = x;
		this.y = y;
		this.gold = 0;
		this.bot = new botClass(x, y);
		this.name = botClass.name;
		this.stunnedRound = -1;
	}
	performAction(surrondings, message) {
		this.bot.performAction(surrondings, message);
	}
	sendMessage(surrondings) {
		this.bot.sendMessage(surrondings);
	}
}
