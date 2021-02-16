import bot from './bot'

// function isNode() {
//   return (
//     typeof process === 'object' &&
//     typeof process.versions === 'object' &&
//     typeof process.versions.node !== undefined
//   )
// }

// if (isNode()) {
//   // @ts-ignore
//   global.fetch = require('node-fetch')
//   // @ts-ignore
//   global.KV = {
//     get() {
//       return null
//     },
//     put() {},
//   }
// }

bot.launch()
