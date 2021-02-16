import { AudioResult } from 'src/types'

export async function tryFetchFromCache(url: string): Promise<AudioResult> {
  const cached = await KV.get(url)
  if (cached !== null) return { fileId: cached }
  return { url }
}

export async function saveToCache(url: string, fileId: string): Promise<void> {
  await KV.put(url, fileId)
}
