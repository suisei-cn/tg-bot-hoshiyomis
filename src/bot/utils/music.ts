import secrets from 'src/secrets'
import { toRomaji } from 'wanakana'
import { MusicInfo } from 'src/types'

export async function searchMusic(text: string) {
  const music_list: MusicInfo[] = await fetch(secrets.metaUrl)
    .then(x => x.json())
    .catch(() => {
      return []
    })
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
