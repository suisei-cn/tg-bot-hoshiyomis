export function leftpad(str: string, len: number): string {
  for (let i = 0; i < len - str.length; i++) {
    str = '0' + str
  }
  return str
}

export function getGeneralNotFoundMessage(query: string): string {
  return `No results for "${query}".\nSend a issue <a href="https://github.com/suisei-cn/suisei-music">here</a> if you think there's something wrong.`
}

function getFilenameFromUrl(url: URL): string {
  const path = url.pathname.split('/')
  return path[path.length - 1]
}

function getNameFromFilename(name: string): string {
  const nameComponent = name.split('.')
  return nameComponent.slice(0, nameComponent.length - 1).join('.')
}

export function getHashByUrl(url: string): string {
  return getNameFromFilename(getFilenameFromUrl(new URL(url)))
}
