import { Telegraf } from 'telegraf'
import { TelegrafContext } from 'telegraf/typings/context'
import secret from '../secrets'
import inlineQueryHandler from '~modules/inline'
import searchHandler from '~modules/search'

const bot = new Telegraf(secret.botToken)

const docs = (ctx: TelegrafContext) => {
  ctx.reply('Welcome to @hosymbot! Use inline queries or /search for music.')
}

bot.start(docs)
bot.help(docs)

bot.on('inline_query', inlineQueryHandler)

bot.command('search', searchHandler)

// bot.on('callback_query', ctx => {
//   // Explicit usage
//   ctx.telegram.answerCbQuery(ctx.callbackQuery.id)

//   // Using context shortcut
//   ctx.answerCbQuery()
// })

export default bot
