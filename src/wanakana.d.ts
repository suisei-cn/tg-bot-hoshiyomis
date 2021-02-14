// This is partial of @types/wanakana.

declare module 'wanakana' {
  // Type definitions for wanakana 4.0
  // Project: https://github.com/WaniKani/WanaKana
  // Definitions by: Ross Hendry <https://github.com/chooban>
  //                 Piotr Błażejewicz <https://github.com/peterblazejewicz>
  // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

  export type IMEModes = true | false | 'toHiragana' | 'toKatakana'

  export interface WanakanaOptions {
    useObsoleteKana?: boolean
    passRomaji?: boolean
    upcaseKatakana?: boolean
    IMEMode?: IMEModes
    romanization?: 'hepburn'
    customKanaMapping?: Record<string, string>
    customRomajiMapping?: Record<string, string>
  }

  export function toRomaji(input: string, options?: WanakanaOptions): string
}
