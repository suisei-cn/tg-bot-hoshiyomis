import secrets from 'src/secrets'

export async function logToSlack(text: string) {
  await fetch(secrets.slackUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  })
}
