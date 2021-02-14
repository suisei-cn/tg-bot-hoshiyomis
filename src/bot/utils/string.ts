export function leftpad(str: string, len: number): string {
  for (let i = 0; i < len - str.length; i++) {
    str = '0' + str
  }
  return str
}
