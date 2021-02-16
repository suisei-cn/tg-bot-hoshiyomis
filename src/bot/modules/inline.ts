import { TelegrafContext } from 'telegraf/typings/context'
import {
  InlineQuery,
  InlineQueryResultAudio,
} from 'telegraf/typings/telegram-types'
import { musicToAudioMeta } from '~utils/convert'
import { rand } from '~utils/math'
import { searchMusic } from '~utils/music'
import { getGeneralNotFoundMessage } from '~utils/string'

export default async (ctx: TelegrafContext) => {
  const inlineQuery = ctx.inlineQuery as InlineQuery
  const query = inlineQuery.query.trim()
  const results = await searchMusic(query)
  if (results.length === 0) {
    ctx.telegram.answerInlineQuery(inlineQuery.id, [
      {
        type: 'article',
        id: rand(),
        title: `No results for "${query}".`,
        input_message_content: {
          message_text: getGeneralNotFoundMessage(query),
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        },
        url: 'https://github.com/suisei-cn/suisei-music',
      },
    ])
    return
  }

  const result: InlineQueryResultAudio[] = results.slice(0, 15).map(x => {
    const meta = musicToAudioMeta(x)
    return {
      ...meta,
      type: 'audio',
      id: rand(),
      audio_url: x.url,
    }
  })

  ctx.answerInlineQuery(result)
}