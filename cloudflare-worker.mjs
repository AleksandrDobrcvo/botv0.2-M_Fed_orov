const TRANSLATIONS = {
  ru: {
    notification: "Уведомление TRONIX",
    newEvent: "У вас новое событие в аккаунте.",
    footerSuccess: "Изменения уже применены в вашем аккаунте.",
    footerError: "Проверьте детали в приложении и при необходимости повторите действие.",
    footerSupport: "Откройте TRONIX, чтобы ответить или посмотреть переписку.",
    footerInfo: "Откройте TRONIX, чтобы посмотреть подробности.",
    time: "Время",
    openApp: "Открыть TRONIX",
    amount: "Сумма",
    accrual: "Начисление",
    heroesCount: "Героев с выплатой",
    cyclesClosed: "Закрыто циклов",
    refLevel: "Реферальный уровень",
    operation: "Операция",
    networkFee: "Сетевой сбор",
    reason: "Причина",
    deposit: "Пополнение",
    withdraw: "Вывод"
  },
  ua: {
    notification: "Сповіщення TRONIX",
    newEvent: "У вас нова подія в акаунті.",
    footerSuccess: "Зміни вже застосовано у вашому акаунті.",
    footerError: "Перевірте деталі в додатку та за потреби повторіть дію.",
    footerSupport: "Відкрийте TRONIX, щоб відповісти або переглянути листування.",
    footerInfo: "Відкрийте TRONIX, щоб переглянути подробиці.",
    time: "Час",
    openApp: "Відкрити TRONIX",
    amount: "Сума",
    accrual: "Нарахування",
    heroesCount: "Героїв з виплатою",
    cyclesClosed: "Закрито циклів",
    refLevel: "Реферальний рівень",
    operation: "Операція",
    networkFee: "Комісія мережі",
    reason: "Причина",
    deposit: "Поповнення",
    withdraw: "Виведення"
  }
};

const WELCOME_TEXT = {
  ru: [
    "🚀 <b>Добро пожаловать в TRONIX!</b> 🤖",
    "",
    "Мир роботов и прибыли уже открыт для тебя.",
    "",
    "У тебя есть возможность:",
    "",
    "🤖 Покупать героев",
    "📈 Получать ежедневный доход в RNX",
    "💸 Обменивать RNX на TON",
    "🤝 Зарабатывать с партнёрской программы",
    "",
    "🎁 Новым пользователям доступен тестовый герой.",
    "",
    "👇 Нажимай кнопку ниже и начинай игру.",
    "",
    "💎 <b>TRONIX</b> — твоя кибер-империя стартует сейчас."
  ].join("\n"),
  ua: [
    "🚀 <b>Ласкаво просимо до TRONIX!</b> 🤖",
    "",
    "Світ роботів та прибутку вже відкритий для тебе.",
    "",
    "У тебе є можливість:",
    "",
    "🤖 Купувати героїв",
    "📈 Отримувати щоденний прибуток у RNX",
    "💸 Обмінювати RNX на TON",
    "🤝 Заробляти з партнерської програми",
    "",
    "🎁 Новим користувачам доступний тестовий герой.",
    "",
    "👇 Натискай кнопку нижче та розпочинай гру.",
    "",
    "💎 <b>TRONIX</b> — твоя кібер-імперія стартує зараз."
  ].join("\n")
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;");
}

function languageForNotification(note) {
  return String(note?.lang || "").toLowerCase() === "ua" ? "ua" : "ru";
}

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  const twoDigits = (part) => String(part).padStart(2, "0");
  return [
    `${twoDigits(date.getUTCDate())}.${twoDigits(date.getUTCMonth() + 1)}.${date.getUTCFullYear()}`,
    `${twoDigits(date.getUTCHours())}:${twoDigits(date.getUTCMinutes())} UTC`
  ].join(" ");
}

function notificationDetails(note, translations) {
  const meta = note?.meta || {};
  const details = [];
  const amountPresent = meta.amount !== undefined && meta.amount !== null && meta.amount !== "";

  if (amountPresent && meta.currency) {
    details.push(`${translations.amount}: <b>${escapeHtml(meta.amount)} ${escapeHtml(meta.currency)}</b>`);
  }

  const rewardPresent = meta.reward !== undefined && meta.reward !== null && meta.reward !== "";
  if (rewardPresent && meta.currency && !amountPresent) {
    details.push(`${translations.accrual}: <b>${escapeHtml(meta.reward)} ${escapeHtml(meta.currency)}</b>`);
  }

  if (meta.heroesCount) {
    details.push(`${translations.heroesCount}: <b>${escapeHtml(meta.heroesCount)}</b>`);
  }
  if (meta.cyclesCount) {
    details.push(`${translations.cyclesClosed}: <b>${escapeHtml(meta.cyclesCount)}</b>`);
  }
  if (meta.level) {
    details.push(`${translations.refLevel}: <b>${escapeHtml(meta.level)}</b>`);
  }
  if (meta.requestType) {
    const operation = meta.requestType === "deposit"
      ? translations.deposit
      : meta.requestType === "withdraw"
        ? translations.withdraw
        : meta.requestType;
    details.push(`${translations.operation}: <b>${escapeHtml(operation)}</b>`);
  }
  if (meta.networkFee) {
    details.push(`${translations.networkFee}: <b>${escapeHtml(meta.networkFee)} TON</b>`);
  }
  if (meta.reason) {
    details.push(`${translations.reason}: <b>${escapeHtml(meta.reason)}</b>`);
  }

  return details;
}

export function buildNotificationMessage(note, webAppUrl) {
  const language = languageForNotification(note);
  const translations = TRANSLATIONS[language];
  const kind = note?.type || "info";
  const icon = {
    success: "✅",
    error: "⚠️",
    support: "💬",
    info: "✨"
  }[kind] || "🔔";
  const footer = {
    success: translations.footerSuccess,
    error: translations.footerError,
    support: translations.footerSupport,
    info: translations.footerInfo
  }[kind] || translations.footerInfo;
  const details = notificationDetails(note, translations);

  const parts = [
    `${icon} <b>${escapeHtml(note?.title || translations.notification)}</b>`,
    "",
    escapeHtml(note?.message || translations.newEvent)
  ];

  if (details.length) {
    parts.push("", ...details.map((detail) => `• ${detail}`));
  }

  parts.push(
    "",
    `<b>${translations.time}:</b> <code>${escapeHtml(formatDateTime(note?.createdAt || ""))}</code>`,
    footer
  );

  if (webAppUrl) {
    parts.push("", `<a href="${escapeHtml(webAppUrl)}">${translations.openApp}</a>`);
  }

  return parts.join("\n");
}

function webAppUrlFor(request, env) {
  return String(env.WEBAPP_URL || new URL(request.url).origin).replace(/\/+$/, "/");
}

function buildKeyboard(language, webAppUrl, referralCode) {
  const isUa = language === "ua";
  const targetUrl = referralCode
    ? `${webAppUrl}${webAppUrl.includes("?") ? "&" : "?"}ref=${encodeURIComponent(referralCode)}`
    : webAppUrl;

  return {
    inline_keyboard: [
      [
        {
          text: isUa ? "🎮 Відкрити TRONIX" : "🎮 Открыть TRONIX",
          web_app: { url: targetUrl }
        }
      ],
      [
        {
          text: isUa ? "📢 Новини" : "📢 Новости",
          url: "https://t.me/Tronix_team"
        },
        {
          text: "💬 Чат",
          url: "https://t.me/Tronix_team"
        }
      ]
    ]
  };
}

async function telegramApi(env, method, payload) {
  if (!env.TELEGRAM_BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    }
  );
  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.description || `Telegram API ${method} failed`);
  }

  return result.result;
}

export async function handleTelegramUpdate(update, request, env) {
  const message = update?.message;
  if (!message?.text || !message?.chat?.id) return;

  const match = message.text.match(/^\/start(?:@\S+)?(?:\s+(\S+))?/);
  if (!match) return;

  const telegramLanguage = String(message.from?.language_code || "").toLowerCase();
  const language = telegramLanguage.startsWith("uk") || telegramLanguage.startsWith("ua")
    ? "ua"
    : "ru";
  const referralCode = match[1]?.startsWith("ref_") ? match[1] : null;
  const webAppUrl = webAppUrlFor(request, env);

  await telegramApi(env, "sendMessage", {
    chat_id: message.chat.id,
    text: WELCOME_TEXT[language],
    parse_mode: "HTML",
    reply_markup: buildKeyboard(language, webAppUrl, referralCode)
  });
}

function shouldDeliver(note) {
  const telegram = note?.telegram || {};
  const chatId = String(telegram.chatId || note?.userId || "");
  return Boolean(telegram.enabled)
    && ["pending", "retry"].includes(telegram.status)
    && note?.audience === "user"
    && /^\d+$/.test(chatId);
}

async function firebaseRequest(env, path, init = {}) {
  const databaseUrl = String(
    env.FIREBASE_DATABASE_URL || "https://mfedorov-521cc-default-rtdb.firebaseio.com"
  ).replace(/\/+$/, "");
  const response = await fetch(`${databaseUrl}/${path.replace(/^\/+/, "")}.json`, init);

  if (!response.ok) {
    throw new Error(`Firebase request failed: ${response.status}`);
  }

  return response;
}

export async function deliverPendingNotifications(env) {
  const response = await firebaseRequest(env, "notifications");
  const notifications = await response.json();
  if (!Array.isArray(notifications) || notifications.length === 0) return 0;

  const batchSize = Math.max(1, Number.parseInt(env.NOTIFICATION_BATCH_SIZE || "8", 10) || 8);
  const webAppUrl = String(env.WEBAPP_URL || "");
  let processed = 0;
  let changed = false;

  for (const note of notifications) {
    if (processed >= batchSize) break;
    if (!shouldDeliver(note)) continue;

    processed += 1;
    changed = true;
    const telegram = note.telegram || {};
    const attempts = Number.parseInt(telegram.attempts || "0", 10) + 1;
    const chatId = String(telegram.chatId || note.userId);

    try {
      await telegramApi(env, "sendMessage", {
        chat_id: chatId,
        text: buildNotificationMessage(note, webAppUrl),
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true }
      });
      note.telegram = {
        ...telegram,
        enabled: true,
        status: "sent",
        sentAt: new Date().toISOString(),
        attempts,
        lastError: "",
        chatId
      };
    } catch (error) {
      note.telegram = {
        ...telegram,
        enabled: true,
        status: attempts < 5 ? "retry" : "failed",
        sentAt: telegram.sentAt || "",
        attempts,
        lastError: error instanceof Error ? error.message : String(error),
        chatId
      };
    }
  }

  if (changed) {
    await firebaseRequest(env, "notifications", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(notifications)
    });
  }

  return processed;
}

async function setupWebhook(request, env) {
  const authorization = request.headers.get("authorization");
  if (!env.WEBHOOK_SECRET || authorization !== `Bearer ${env.WEBHOOK_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const webhookUrl = `${new URL(request.url).origin}/telegram/webhook`;
  const result = await telegramApi(env, "setWebhook", {
    url: webhookUrl,
    secret_token: env.WEBHOOK_SECRET,
    allowed_updates: ["message"],
    drop_pending_updates: false
  });

  return Response.json({ ok: true, webhookUrl, result });
}

async function handleRequest(request, env, context) {
  const url = new URL(request.url);

  if (url.pathname === "/health") {
    return Response.json({ ok: true, service: "tronix-game-app" });
  }

  if (url.pathname === "/telegram/setup" && request.method === "POST") {
    return setupWebhook(request, env);
  }

  if (url.pathname === "/telegram/webhook" && request.method === "POST") {
    if (
      !env.WEBHOOK_SECRET
      || request.headers.get("x-telegram-bot-api-secret-token") !== env.WEBHOOK_SECRET
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    const update = await request.json();
    context.waitUntil(handleTelegramUpdate(update, request, env));
    context.waitUntil(deliverPendingNotifications(env));
    return new Response("OK");
  }

  return env.ASSETS.fetch(request);
}

export default {
  fetch: handleRequest,
  scheduled(_controller, env, context) {
    context.waitUntil(deliverPendingNotifications(env));
  }
};
