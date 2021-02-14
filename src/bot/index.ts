import { Telegraf } from 'telegraf'
import { TelegrafContext } from 'telegraf/typings/context'
import secret from '../secrets'
import inlineQueryHandler from '~modules/inline'
import { IncomingMessage } from 'telegraf/typings/telegram-types'
import { searchMusic } from '~utils/music'
import { getGeneralNotFoundMessage } from '~utils/string'
import { musicToAudioMeta } from './utils/convert'

const bot = new Telegraf(secret.botToken)

const docs = (ctx: TelegrafContext) => {
  ctx.reply('Welcome to @hosymbot! Use inline queries or /search for music.')
}

bot.start(docs)
bot.help(docs)

bot.on('inline_query', inlineQueryHandler)

bot.command('search', async ctx => {
  const message = ctx.message as IncomingMessage
  const text = message.text

  if (!text) {
    ctx.reply(`No text`)
    return
  }
  if (!text.startsWith('/search')) {
    ctx.reply(`Unrecognized query: ${text}`)
    return
  }
  const query = text.replace(/^\/search(@\w+)? /, '')
  if (!query) {
    ctx.reply(`Empty search query.`)
    return
  }

  const results = await searchMusic(query)
  if (results.length === 0) {
    ctx.reply(getGeneralNotFoundMessage(query), {
      parse_mode: 'MarkdownV2',
    })
    return
  }

  const returningResults = results.slice(0, 15)
  const sliced = returningResults.length < results.length

  ctx.reply(
    `${sliced ? 'First ' : ''}${
      returningResults.length
    } search result(s) for "${query}":`,
    {
      reply_markup: {
        inline_keyboard: results.slice(0, 15).map(x => {
          const meta = musicToAudioMeta(x)
          return [
            {
              text: meta.caption,
              callback_data: meta.hash,
            },
          ]
        }),
      },
    }
  )
})

// bot.on('callback_query', ctx => {
//   // Explicit usage
//   ctx.telegram.answerCbQuery(ctx.callbackQuery.id)

//   // Using context shortcut
//   ctx.answerCbQuery()
// })

export default bot
