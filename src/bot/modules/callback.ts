
import { CallbackQuery } from 'telegraf/typings/telegram-types'
import { queryMusicByHash } from '~utils/music'
import { musicToAudioMeta } from '~utils/convert'
import { TelegrafContext } from 'telegraf/typings/context'

export default async (ctx:TelegrafContext) => {
    const cbQuery = ctx.callbackQuery as CallbackQuery
    const responseChatId = cbQuery.message?.chat.id
    const hash = cbQuery.data || ''
  
    if (!hash) {
      ctx.answerCbQuery()
      return
    }
  
    if (!responseChatId) {
      ctx.answerCbQuery('We cannot find a chat to send the audio you requested.')
      return
    }
  
    const music = await queryMusicByHash(hash)
  
    if (music === null) {
      ctx.answerCbQuery('The music is not found.')
      return
    }
  
    ctx.telegram.sendAudio(responseChatId, music.url, 
      musicToAudioMeta(music)
    )
  
    ctx.answerCbQuery()
  }