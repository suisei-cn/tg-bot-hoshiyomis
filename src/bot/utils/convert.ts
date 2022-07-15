import { AudioMeta, MusicInfo } from 'src/types'
import { getHashByUrl, leftpad } from './string'

const SUISEI_AFFILIATED = [
  '星街すいせい',
  'Midnight Grand Orchestra', // https://twitter.com/m_g_orchestra
]

export function musicToAudioMeta(i: MusicInfo): AudioMeta {
  let dateTime = new Date(i.datetime)

  // Set to UTC+8
  dateTime.setHours(dateTime.getHours() + 8)

  let dtStr = `${dateTime.getUTCFullYear()}/${dateTime.getUTCMonth() +
    1}/${dateTime.getUTCDate()} ${leftpad(
    String(dateTime.getUTCHours()),
    2
  )}:${leftpad(String(dateTime.getUTCMinutes()), 2)}`

  /** 
        Case 1:  isSuiseiOriginal, isOriginal  | Suisei original, use 星街すいせい - {title}
        Case 2: !isSuiseiOriginal, isOriginal  | Original, suisei with others, use {performers} - {title}
        Case 3: !isSuiseiOriginal, !isOriginal | Feat only, use {original} - {title} (feat. {performers})
    **/
  let isSuiseiOriginal = SUISEI_AFFILIATED.includes(i.artist || '')
  let isOriginal = isSuiseiOriginal || i.artist === ''
  return {
    hash: getHashByUrl(i.url),
    title: `${i.title} (${dtStr})`,
    performer: isOriginal ? i.performer : `${i.artist} (feat. ${i.performer})`,
    caption:
      (isOriginal
        ? `${i.performer} - ${i.title}`
        : `${i.artist} - ${i.title} (feat. ${i.performer})`) + ` (${dtStr})`,
  }
}
