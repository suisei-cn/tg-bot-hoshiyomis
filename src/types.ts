export interface MusicInfo {
  url: string
  datetime: string
  title: string
  artist: string
  performer: string
  status: number
  source: string
}

export interface AudioMeta {
  hash: string
  title: string
  performer: string
  caption: string
}

export interface AudioResultCached {
  fileId: string
}

export interface AudioResultNonCached {
  url: string
}

export type AudioResult = AudioResultCached | AudioResultNonCached
