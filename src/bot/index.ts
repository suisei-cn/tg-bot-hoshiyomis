import { Telegraf } from 'telegraf'
import { TelegrafContext } from 'telegraf/typings/context'
import secret from '../secrets'
import inlineQueryHandler from '~modules/inline'

const bot = new Telegraf(secret.botToken)

const docs = (ctx: TelegrafContext) => {
  ctx.reply('Welcome to @hosymbot! Use inline queries or /search for music.')
}

bot.start(docs)
bot.help(docs)

bot.on('inline_query', inlineQueryHandler)

export default bot
