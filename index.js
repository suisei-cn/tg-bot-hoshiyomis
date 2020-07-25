addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

const BOT_KEY = "BOT_KEY";
const BASEURL = "BOT_WORKER_DOMAIN";
const METAURL = "SUISEI_MUSIC_WORKER_DOMAIN";
const { toRomaji } = require("wanakana");

function rand() {
  return String(Math.random()) + String(Math.random());
}

async function sendMessage(chat_id, text) {
  return await fetch(`https://api.telegram.org/bot${BOT_KEY}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      chat_id,
      text,
    }),
  });
}

async function answerInlineQuery(inline_query_id, results) {
  const ret = await fetch(
    `https://api.telegram.org/bot${BOT_KEY}/answerInlineQuery`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        inline_query_id,
        results,
        cache_time: 600,
      }),
    }
  ).then((x) => x.json());
}

/**
 * Return searched songs
 * @param {String} text
 * @returns {Object[]}
 */
async function searchSong(text) {
  const music_list = await fetch(METAURL)
    .then((x) => x.json())
    .catch(() => {
      return [];
    });
  text = text.toLowerCase();
  return music_list.reverse().filter(
    (x) =>
      (x.title || "").toLowerCase().includes(text) ||
      (x.artist || "").toLowerCase().includes(text) ||
      toRomaji(x.title || "")
        .toLowerCase()
        .includes(toRomaji(text)) ||
      toRomaji(x.artist || "")
        .toLowerCase()
        .includes(toRomaji(text))
  );
}

async function handleMessage(message) {
  const text = String(message.text) || "";
  if (!text.includes("/music")) return;
  const keyword = text.replace(/^\/music(@hosymbot)?/, "");
  const results = await searchSong(keyword);
}

function lp(str, len) {
  str = String(str);
  for (let i = 0; i < len - str.length; i++) {
    str = "0" + str;
  }
  return str;
}

async function handleInline(inlineQuery) {
  const text = String(inlineQuery.query) || ''
  const results = await searchSong(text)
  const ret = []
  if (results.length === 0) {
    ret.push({
      type: 'article',
      id: rand(),
      title: `No results for "${text}".`,
      input_message_content: {
        message_text: `No results for "${text}". Send PR [here](https://github.com/suisei-cn/suisei-music) for any missing results.`,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      },
      url: 'https://github.com/suisei-cn/suisei-music',
    })
  } else {
    for (const i of results.slice(0, 15)) {
      let dateTime = new Date(i.datetime)
      dateTime.setHours(dateTime.getHours() + 8)

      let dtStr = `${dateTime.getUTCFullYear()}/${
        dateTime.getUTCMonth() + 1
      }/${dateTime.getUTCDate()} ${lp(dateTime.getUTCHours(), 2)}:${lp(
        dateTime.getUTCMinutes(),
        2
      )}`

      /*
      Case 1:  isSuiseiOriginal, isOriginal  | Suisei original, use 星街すいせい - {title}
      Case 2: !isSuiseiOriginal, isOriginal  | Original, suisei with others, use {performers} - {title}
      Case 3: !isSuiseiOriginal, !isOriginal | Feat only, use {original} - {title} (feat. {performers})
      */
      let isSuiseiOriginal = (i.artist || '').includes('星街すいせい')
      let isOriginal = isSuiseiOriginal || i.artist === ''
      ret.push({
        type: 'audio',
        id: rand(),
        audio_url: i.url,
        title: `${i.title} (${dtStr})`,
        performer: isOriginal
          ? i.performer
          : `${i.artist} (feat. ${i.performer})`,
        caption:
          (isOriginal
            ? `${i.performer} - ${i.title}`
            : `${i.artist} - ${i.title} (feat. ${i.performer})`) +
          ` (${dtStr})`,
      })
    }
  }
  await answerInlineQuery(inlineQuery.id, ret)
}

async function handler(request) {
  if (request.method != "POST") return;
  const body = await request.json().catch((x) => {
    return {};
  });
  // if (body.message) {
  //   await handleMessage(body.message);
  // } else
  if (body.inline_query) {
    await handleInline(body.inline_query);
  }
}

/**
 *
 * @param {Request} request
 */
async function handleRequest(request) {
  let path = new URL(request.url).pathname;
  if (path == "/acct") {
    const resp = await fetch(
      `https://api.telegram.org/bot${BOT_KEY}/setWebhook?url=${BASEURL}`
    );
    return resp.clone();
  }
  await handler(request);
  return new Response("OK", { status: 200 });
}
