require('dotenv').config()
const telegramBot = require('Class/telegramBot');
const jira = require('Class/JiraApi');
const UserBD = require('Models/UsersBD');
const { mongodb } = require('Models/MongoBD');
const FeedBackApp = new (class FeedBackApp {
	constructor() {
	}
	async init() {
		await mongodb.init();
		await UserBD.init();
		await jira.init();
		await telegramBot.init();
	}
})();

FeedBackApp.init();

