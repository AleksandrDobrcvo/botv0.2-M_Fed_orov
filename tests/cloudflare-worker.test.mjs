import assert from "node:assert/strict";
import test from "node:test";

import { buildNotificationMessage, handleTelegramUpdate } from "../cloudflare-worker.mjs";

test("buildNotificationMessage escapes user-controlled HTML", () => {
  const message = buildNotificationMessage(
    {
      type: "success",
      title: "<script>",
      message: "готово & проверено",
      createdAt: "2026-07-24T10:30:00Z",
      meta: { amount: "12", currency: "RNX" }
    },
    "https://example.com/"
  );

  assert.match(message, /&lt;script&gt;/);
  assert.match(message, /готово &amp; проверено/);
  assert.match(message, /24\.07\.2026 10:30 UTC/);
  assert.match(message, /12 RNX/);
});

test("handleTelegramUpdate sends /start with referral URL", async () => {
  const originalFetch = globalThis.fetch;
  let requestBody;

  globalThis.fetch = async (_url, init) => {
    requestBody = JSON.parse(init.body);
    return Response.json({ ok: true, result: true });
  };

  try {
    await handleTelegramUpdate(
      {
        message: {
          text: "/start ref_123",
          chat: { id: 42 },
          from: { language_code: "ru" }
        }
      },
      new Request("https://tronix.example/telegram/webhook"),
      {
        TELEGRAM_BOT_TOKEN: "test-token",
        WEBAPP_URL: "https://tronix.example/"
      }
    );
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(requestBody.chat_id, 42);
  assert.equal(
    requestBody.reply_markup.inline_keyboard[0][0].web_app.url,
    "https://tronix.example/?ref=ref_123"
  );
});
