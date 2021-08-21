import { Application, Router } from '@cfworker/web'
import createTelegrafMiddware from 'cfworker-middware-telegraf'
import secret from './secrets'

import bot from './bot'

const router = new Router()
router.post(`/webhook-${secret.webhook}`, createTelegrafMiddware(bot))
router.put(`/push-${secret.metadataUpdateEndpoint}`, async ({ req, res }) => {
  const json = await req.body.json()
  await KV.put(json.key, json.value)
  res.type = 'text/plain'
  res.body = 'OK'
})
router.delete(
  `/push-${secret.metadataUpdateEndpoint}`,
  async ({ req, res }) => {
    const json = await req.body.json()
    await KV.delete(json.key)
    res.type = 'text/plain'
    res.body = 'OK'
  }
)
new Application().use(router.middleware).listen()
