export default {
  domain: DOMAIN,
  webhook: 'prod',
  botToken: BOT_TOKEN,
  whitelistedHostnames: WHITELISTED_HOSTNAMES.split('|').map((x) => x.trim()),
  metaUrl: META_URL,
}
