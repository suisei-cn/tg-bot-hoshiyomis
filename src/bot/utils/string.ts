export function leftpad(str: string, len: number): string {
  for (let i = 0; i < len - str.length; i++) {
    str = '0' + str
  }
  return str
}

export function getGeneralNotFoundMessage(query: string): string {
  return `No results for "${query}".\nSend a issue [here](https://github.com/suisei-cn/suisei-music) if you think there's something wrong.`
}

export function getFilenameFromUrl(url: URL): string {
  const path = url.pathname.split('/')
  return path[path.length - 1]
}

export function getNameFromFilename(name: string): string {
  const nameComponent = name.split('.')
  return nameComponent.slice(0, nameComponent.length - 1).join('.')
}
