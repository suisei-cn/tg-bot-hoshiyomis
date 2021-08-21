import { IncomingMessage } from 'telegraf/typings/telegram-types'
import { TelegrafContext } from 'telegraf/typings/context'
import { getMusic } from '../utils/music'

export default async (ctx: TelegrafContext) => {
  const message = ctx.message as IncomingMessage
  const text = message.text

  if (!text) {
    ctx.reply(`No text`)
    return
  }
  if (!text.startsWith('/check')) {
    ctx.reply(`Unrecognized query: ${text}`)
    return
  }
  const query = text.replace(/^\/check(@\w+)? /, '')
  if (!query) {
    ctx.reply(`Empty search query.`)
    return
  }

  const musicList = await getMusic()
  const lists = musicList.filter(x => x.url.includes(query))
  if (lists.length === 0) {
    ctx.reply(`No items found with "${query}".`)
    return
  }

  const results = await Promise.all(lists.map(x => KV.get(x.url)))
  ctx.reply(
    results
      .map((v, i) =>
        v !== null ? `HITS ${lists[i].url}: ${v}` : `MISS ${lists[i].url}`
      )
      .join('\n')
  )
}
