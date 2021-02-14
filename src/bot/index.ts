import { Telegraf } from 'telegraf'
import secret from '../secrets'

const bot = new Telegraf(secret.botToken)

bot.use(async (ctx, next) => {
  ctx.reply(ctx.message?.text ?? `OOPS, I don't understand.`)
  await next
})

export default bot
