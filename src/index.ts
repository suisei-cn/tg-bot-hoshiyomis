import bot from './bot'

const isNode = new Function(
  'try {return this===global;}catch(e){return false;}'
)

if (isNode()) {
  // @ts-ignore
  global.fetch = require('node-fetch')
  // @ts-ignore
  global.KV = {
    get() {
      return null
    },
    put() {},
  }
}

bot.launch()
