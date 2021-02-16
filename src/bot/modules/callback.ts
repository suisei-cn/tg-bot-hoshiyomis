
import { CallbackQuery } from 'telegraf/typings/telegram-types'
import { queryMusicByHash } from '~utils/music'
import { musicToAudioMeta } from '~utils/convert'
import { TelegrafContext } from 'telegraf/typings/context'
import { saveToCache, tryFetchFromCache } from '~utils/file'
import { AudioResultCached, AudioResultNonCached } from 'src/types'
import { logToSlack } from '~utils/slack'

export default async (ctx:TelegrafContext) => {
    const cbQuery = ctx.callbackQuery as CallbackQuery
    const responseChatId = cbQuery.message?.chat.id
    const hash = cbQuery.data || ''
  
    if (!hash) {
      await ctx.answerCbQuery()
      return
    }
  
    if (!responseChatId) {
      await ctx.answerCbQuery('We cannot find a chat to send the audio you requested.')
      return
    }
  
    const music = await queryMusicByHash(hash)
  
    if (music === null) {
      await   ctx.answerCbQuery('The music is not found.')
      return
    }

    await ctx.answerCbQuery()

    const audioCached = await tryFetchFromCache(music.url)
    
    if ((audioCached as AudioResultCached).fileId) {
      ctx.telegram.sendAudio(responseChatId, (audioCached as AudioResultCached).fileId, 
        musicToAudioMeta(music)
      )
    } else {
      const url = (audioCached as AudioResultNonCached).url
      const audioResult = await ctx.telegram.sendAudio(responseChatId, url,
        musicToAudioMeta(music)
      )
      const fileId = audioResult.document?.file_id || audioResult.audio?.file_id
      if (fileId){
        await saveToCache(url, fileId)
      } else {
        await logToSlack(`No fileId for ${url}`)
      }
      await logToSlack(`Saved: ${JSON.stringify(audioResult)}`)
    }
  }