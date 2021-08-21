import { Telegraf } from 'telegraf'
import { TelegrafContext } from 'telegraf/typings/context'
import secret from '../secrets'
import inlineQueryHandler from '~modules/inline'
import searchHandler from '~modules/search'
import callbackQueryHandler from '~modules/callback'
import checkHandler from '~modules/check'
import { sendLog } from 'src/bot/utils/remotelog'

const bot = new Telegraf(secret.botToken)

const docs = (ctx: TelegrafContext) => {
  ctx.reply(
    'Welcome to @hosymbot! Use inline queries or /search for music.\n<a href="https://github.com/suisei-cn/suisei-music">Music source</a> | <a href="https://github.com/suisei-cn/tg-bot-hoshiyomis">Source code</a>\nBrought to you with ❤️ by <a href="https://github.com/suisei-cn">@suisei-cn</a>',
    {
      disable_web_page_preview: true,
      parse_mode: 'HTML',
    }
  )
}

bot.start(docs)
bot.help(docs)

bot.on('inline_query', inlineQueryHandler)

bot.command('search', searchHandler)

bot.command('check', checkHandler)

bot.on('callback_query', callbackQueryHandler)

bot.catch(async (err: Error, ctx: TelegrafContext) => {
  await sendLog(
    `Ooops, encountered an error for ${ctx.updateType}: ${String(err)}`,
    'Bot Error'
  )
})

export default bot
