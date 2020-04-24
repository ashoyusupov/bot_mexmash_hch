const TelegramBot  = require('node-telegram-bot-api')
const config = require('./config/config')

const TOKEN = config.salesonbot.token

const bot = new TelegramBot(TOKEN,{
	webHook: {
		port: config.salesonbot.port,
		autoOpen: false
	}
})


bot.openWebHook()
bot.setWebHook(`${config.salesonbot.url}/bot${TOKEN}`)

bot.sendMessage(239764523, 'Спасибо за Ваш ответ! 😊')
bot.closeWebHook()