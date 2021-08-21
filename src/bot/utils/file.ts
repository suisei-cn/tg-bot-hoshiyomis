import { AudioResult, MusicInfo } from 'src/types'
import { sendLogRaw } from './remotelog'

export async function tryFetchFromCache(url: string): Promise<AudioResult> {
  const cached = await KV.get(url)
  if (cached !== null) return { fileId: cached }
  return { url }
}

export async function saveToCache(
  url: string,
  fileId: string,
  meta: MusicInfo
): Promise<void> {
  await KV.put(url, fileId)
  sendLogRaw({
    '@type': 'MessageCard',
    '@context': 'https://schema.org/extensions',
    summary: `New entry cached: ${fileId}`,
    themeColor: '7bd5eb',
    title: 'New entry cached',
    sections: [
      {
        activityTitle: '@hosymbot',
        activitySubtitle: new Date().toLocaleString(),
        facts: [
          {
            name: 'Entry:',
            value: url,
          },
          {
            name: 'File ID:',
            value: fileId,
          },
          {
            name: 'Music',
            value: `${meta.artist} - ${meta.title}`,
          },
        ],
        text: 'The following audio is cached on Telegram.',
      },
    ],
  })
}
