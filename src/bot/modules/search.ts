import { IncomingMessage } from 'telegraf/typings/telegram-types'
import { searchMusic } from '~utils/music'
import { getGeneralNotFoundMessage } from '~utils/string'
import { musicToAudioMeta } from '~utils/convert'
import { TelegrafContext } from 'telegraf/typings/context'

export default async (ctx: TelegrafContext) => {
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
}
