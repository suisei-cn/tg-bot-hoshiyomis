import secrets from 'src/secrets'

export async function sendLog(text: string, title: string) {
  await fetch(secrets.msWebhookUrl, {
    method: 'POST',
    body: JSON.stringify({
      '@type': 'MessageCard',
      '@context': 'https://schema.org/extensions',
      themeColor: '7bd5eb',
      title,
      sections: [
        {
          activityTitle: '@hosymbot',
          activitySubtitle: new Date().toLocaleString(),
          text,
        },
      ],
    }),
  })
}

export async function sendLogRaw(item: any) {
  await fetch(secrets.msWebhookUrl, {
    method: 'POST',
    body: JSON.stringify(item),
  })
}
