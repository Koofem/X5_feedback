const { Telegraf } = require('telegraf')
const keyboardsCommands = require('Constants/Keyboards')
const messageHandler = require('Backs/MessageHandler')
require('dotenv')


class TelegramBot {
	constructor() {}
	bot = new Telegraf(process.env.BOT_TOKEN)

	async init() {
		await this.startListening();
	}

	startListening() {
		this.bot.start((ctx) => messageHandler.restartAndStartCommandHandler(ctx))
		this.bot.command('restart', (ctx) => messageHandler.restartAndStartCommandHandler(ctx));
		this.bot.hears(keyboardsCommands.ANONYMOUS_FEEDBACK, (ctx)=> messageHandler.anonymousFeedback(ctx))
		this.bot.hears(keyboardsCommands.OPEN_FEEDBACK, (ctx)=> messageHandler.openFeedback(ctx))
		this.bot.hears(keyboardsCommands.BACK, (ctx)=> messageHandler.back(ctx))
		this.bot.on('text', (ctx) => messageHandler.simpleMessageHandler(ctx));

		this.bot.launch().then(()=> {
			console.log('Все заебись, бот запущен')
		})
	}
}

const telegramBot = new TelegramBot();
module.exports = telegramBot;
