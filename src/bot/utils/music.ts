import secrets from 'src/secrets'
import { toRomaji } from 'wanakana'
import { MusicInfo } from 'src/types'
import { getHashByUrl } from './string'

export function getMusic(): Promise<MusicInfo[]> {
  return fetch(secrets.metaUrl)
    .then(x => x.json())
    .catch(() => {
      return []
    })
}

export async function searchMusic(text: string): Promise<MusicInfo[]> {
  const music_list = await getMusic()
  text = text.toLowerCase()
  return music_list.reverse().filter(
    x =>
      (x.title || '').toLowerCase().includes(text) ||
      (x.artist || '').toLowerCase().includes(text) ||
      toRomaji(x.title || '')
        .toLowerCase()
        .includes(toRomaji(text)) ||
      toRomaji(x.artist || '')
        .toLowerCase()
        .includes(toRomaji(text))
  )
}

export async function queryMusicByHash(
  hash: string
): Promise<MusicInfo | null> {
  const music_list = await getMusic()
  const results = music_list.reverse().filter(x => getHashByUrl(x.url) === hash)
  return results.length ? results[0] : null
}
