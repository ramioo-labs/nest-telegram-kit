# nest-telegram-kit

NestJS + Telegraf starter kit for production Telegram bots.

## Webhook authentication

Set `TELEGRAM_WEBHOOK_SECRET` and send the same value in the `X-Telegram-Bot-Api-Secret-Token` header (Telegram webhook secret token).

Missing or wrong tokens return `401`. Malformed JSON bodies return `400`. The secret is never logged.

```ts
import { validateWebhookSecret, parseUpdateJson } from './src/telegram/webhook-auth';

const auth = validateWebhookSecret(req.header('x-telegram-bot-api-secret-token'), process.env.TELEGRAM_WEBHOOK_SECRET);
if (!auth.ok) return res.status(auth.status).end();

const parsed = parseUpdateJson(rawBody);
if (!parsed.ok) return res.status(parsed.status).end();
```

## Scripts

- `npm test` — unit tests
- `npm run build` — TypeScript compile

Closes #1 when merged with webhook auth helpers + tests.
