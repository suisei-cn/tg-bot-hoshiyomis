import secrets from 'src/secrets'
import { Buffer } from 'buffer'
import { AudioResult, AudioResultCached, MusicInfo } from 'src/types'
import { TelegrafContext } from 'telegraf/typings/context'
import { musicToAudioMeta } from './convert'

export async function tryFetchFromCache(url: string): Promise<AudioResult> {
  const cached = await KV.get(url)
  if (cached !== null) return { fileId: cached }
  return { url }
}

export async function fetchAndCache(
  music: MusicInfo,
  ctx: TelegrafContext
): Promise<AudioResultCached> {
  const url = music.url
  const extraInfo = musicToAudioMeta(music)
  const objArrayBuffer = await fetch(url).then(x => x.arrayBuffer())
  const objBuffer = Buffer.from(objArrayBuffer)
  const resp = await ctx.telegram.sendAudio(
    secrets.cacheChat,
    { source: objBuffer },
    extraInfo
  )
  const fileId = resp.audio.file_id
  await KV.put(url, fileId)
  return { fileId }
}

export async function fetchFromCacheOrCache(
  music: MusicInfo,
  ctx: TelegrafContext
): Promise<AudioResultCached> {
  const cached = await tryFetchFromCache(music.url)
  if ((cached as AudioResultCached).fileId) return cached as AudioResultCached
  return await fetchAndCache(music, ctx)
}
