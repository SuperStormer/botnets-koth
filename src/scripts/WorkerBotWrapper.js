/*eslint no-unused-vars:0*/
export default class WorkerBotWrapper {
	constructor(x, y, index, name, color, botClass) {
		this.x = x;
		this.y = y;
		this.index = index;
		this.gold = 0;
		this.color = color;
		this.bot = new botClass(index);
		this.name = `${name}#${index}`;
		this.stunnedRound = undefined;
		this.alive = true;
	}
	performAction(message) {
		return this.bot.performAction(message);
	}
	sendMessage(x, y, surrondings) {
		return this.bot.sendMessage(x, y, surrondings);
	}
}
