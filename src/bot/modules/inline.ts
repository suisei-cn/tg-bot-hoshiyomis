import { AudioResultCached } from 'src/types'
import { TelegrafContext } from 'telegraf/typings/context'
import {
  InlineQuery,
  InlineQueryResultAudio,
  InlineQueryResultCachedAudio,
} from 'telegraf/typings/telegram-types'
import { musicToAudioMeta } from '~utils/convert'
import { rand } from '~utils/math'
import { searchMusic } from '~utils/music'
import { getGeneralNotFoundMessage } from '~utils/string'
import { tryFetchFromCache } from '../utils/file'

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

  const result: (InlineQueryResultAudio|InlineQueryResultCachedAudio)[] = await Promise.all(
    results.slice(0, 15).map(async (x) => {
      const meta = musicToAudioMeta(x)
      const baseResult = { ...meta, type: 'audio', id: rand(), audio_url: x.url }
      const result = await tryFetchFromCache(x.url)
      if ((result as AudioResultCached).fileId) {
        return {
          ...baseResult,
          audio_file_id: (result as AudioResultCached).fileId,
        }
      } else {
        return baseResult
      }
    })
  )

  // It's weird that there will be problems if InlineQueryResultCachedAudio is mixed w/ InlineQueryResultAudio.
  if (result.filter(x => (x as InlineQueryResultCachedAudio).audio_file_id).length === result.length) {
    await ctx.answerInlineQuery(result.map(x => {
      // @ts-ignore
      x.audio_url = undefined
      return x
    }))
  } else {
    await ctx.answerInlineQuery(result.map(x => {
      // @ts-ignore
      x.audio_file_id = undefined
      return x
    }))
  }
}
