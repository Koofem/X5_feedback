const messages = require('Constants/MessagesFromBot')
const keyboardsCommands = require('Constants/Keyboards')
const actions = require('Constants/Actions')
const userBD = require('Models/UsersBD')
const jira = require('Class/JiraApi');
require('dotenv')
class MessageHandler {
	async restartAndStartCommandHandler(ctx) {
		await userBD.saveOrUpdateUser(ctx.from);
		await ctx.telegram.sendMessage(ctx.chat.id, messages.GREETINGS_MESSAGE, {
			reply_markup: {
				keyboard: [
					[keyboardsCommands.OPEN_FEEDBACK, keyboardsCommands.ANONYMOUS_FEEDBACK],
				],
				resize_keyboard: true,
			},
			parse_mode: "HTML"
		})
	}

	async back(ctx) {
		await userBD.resetUserAction(ctx.from)
		await ctx.telegram.sendMessage(ctx.chat.id, messages.BACK_BUTTON_MESSAGE, {
			reply_markup: {
				keyboard: [
					[keyboardsCommands.OPEN_FEEDBACK, keyboardsCommands.ANONYMOUS_FEEDBACK],
				],
				resize_keyboard: true,
			},
			parse_mode: "HTML"
		})
	}

	async anonymousFeedback(ctx) {
		await userBD.setActionToUser(ctx.from, actions.ANONYMOUS_FEEDBACK)
		await ctx.telegram.sendMessage(ctx.chat.id, messages.FEEDBACK_MESSAGE, {
			reply_markup: {
				keyboard: [[keyboardsCommands.BACK]],
				resize_keyboard: true
			}
		})
	}

	async simpleMessageHandler(ctx) {
		const user = await userBD.findUser(ctx.from);
		if (!user.current_action) {
		return await ctx.telegram.sendMessage(ctx.chat.id, messages.SIMPLE_MESSAGE, {
				reply_markup: {
					keyboard: [
						[keyboardsCommands.OPEN_FEEDBACK, keyboardsCommands.ANONYMOUS_FEEDBACK],
					],
					resize_keyboard: true,
				},
				parse_mode: "HTML"
			})
		} else {
			switch (user.current_action) {
				case actions.ANONYMOUS_FEEDBACK:
					return this.anonymousFeedbackHandler(ctx)
				case actions.OPEN_FEEDBACK_INTRODUCE:
					return this.openFeedbackIntroduce(ctx)
				case actions.OPEN_FEEDBACK:
					return this.openFeedbackHandler(ctx)
			}

		}
	}

	async anonymousFeedbackHandler(ctx) {
		try {
			const incomingMessage = ctx.update.message.text;
			await ctx.telegram.sendMessage(ctx.from.id, messages.THANKS_MESSAGE, {
				reply_markup: {
					keyboard: [
						[keyboardsCommands.OPEN_FEEDBACK, keyboardsCommands.ANONYMOUS_FEEDBACK],
					],
					resize_keyboard: true,
				},
			})
			await userBD.resetUserAction(ctx.from)
			const jiraTask = await jira.createJiraTask('Анонимная обратная связь', incomingMessage);
			return await ctx.telegram.sendMessage(process.env.TELEGRAM_CHANNEL_ID, `Получена новая анонимная обратная связь\n${process.env.JIRA_LINK}${jiraTask.key}`, {
				parse_mode: 'HTML'
			});
		} catch (e) {
			await ctx.telegram.sendMessage(ctx.from.id, messages.ERROR_MESSAGE, {
				reply_markup: {
					keyboard: [
						[keyboardsCommands.OPEN_FEEDBACK, keyboardsCommands.ANONYMOUS_FEEDBACK],
					],
					resize_keyboard: true,
				},
			})
		}
	}

	async openFeedback(ctx) {
		await userBD.setActionToUser(ctx.from, actions.OPEN_FEEDBACK_INTRODUCE)
		await ctx.telegram.sendMessage(ctx.chat.id, messages.OPEN_FEEDBACK_INTRODUCE, {
			reply_markup: {
				keyboard: [[keyboardsCommands.BACK]],
				resize_keyboard: true
			}
		})
	}

	async openFeedbackIntroduce(ctx) {
		try {
			const incomingMessage = ctx.update.message.text;
			await userBD.setFullInfoAboutUser(ctx.from, incomingMessage);
			await userBD.setActionToUser(ctx.from, actions.OPEN_FEEDBACK);
			await ctx.telegram.sendMessage(ctx.chat.id, messages.FEEDBACK_MESSAGE, {
				reply_markup: {
					keyboard: [[keyboardsCommands.BACK]],
					resize_keyboard: true
				}
			})
		} catch (e) {
			await ctx.telegram.sendMessage(ctx.from.id, messages.ERROR_MESSAGE, {
				reply_markup: {
					keyboard: [
						[keyboardsCommands.OPEN_FEEDBACK, keyboardsCommands.ANONYMOUS_FEEDBACK],
					],
					resize_keyboard: true,
				},
			})
		}
	}

	async openFeedbackHandler(ctx) {
		try {
			const incomingMessage = ctx.update.message.text;
			const fullInfoAboutUser = await userBD.getFullInfoAboutUser(ctx.from)
			await ctx.telegram.sendMessage(ctx.from.id, messages.THANKS_MESSAGE, {
				reply_markup: {
					keyboard: [
						[keyboardsCommands.OPEN_FEEDBACK, keyboardsCommands.ANONYMOUS_FEEDBACK],
					],
					resize_keyboard: true,
				},
			})
			await userBD.resetUserAction(ctx.from)
			await userBD.deleteFullInfoAboutUser(ctx.from)
			const jiraTask = await jira.createJiraTask('Открытая обратная связь', `${incomingMessage}\nПолучена от ${fullInfoAboutUser}`);
			return await ctx.telegram.sendMessage(process.env.TELEGRAM_CHANNEL_ID, `Получена новая открытиая обратная связь\n${process.env.JIRA_LINK}${jiraTask.key}`, {
				parse_mode: 'HTML'
			});
		} catch (e) {
			await ctx.telegram.sendMessage(ctx.from.id, messages.ERROR_MESSAGE, {
				reply_markup: {
					keyboard: [
						[keyboardsCommands.OPEN_FEEDBACK, keyboardsCommands.ANONYMOUS_FEEDBACK],
					],
					resize_keyboard: true,
				},
			})
		}
	}
}

const messageHandler = new MessageHandler();
module.exports = messageHandler;
