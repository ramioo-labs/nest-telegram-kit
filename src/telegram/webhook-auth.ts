import { createHmac, timingSafeEqual } from 'node:crypto';

export type WebhookAuthResult =
    | { ok: true }
  | { ok: false; status: 401 | 400; reason: 'missing_token' | 'invalid_token' | 'malformed_json' };

/**
 * Validate Telegram webhook secret token without logging the secret.
 * Prefer comparing via timing-safe equality when both sides are present.
 */
export function validateWebhookSecret(
    providedHeader: string | undefined,
    expectedSecret: string | undefined,
  ): WebhookAuthResult {
    if (!expectedSecret) {
          // Misconfiguration: fail closed in production-style setups.
      return { ok: false, status: 401, reason: 'missing_token' };
    }
    if (!providedHeader) {
          return { ok: false, status: 401, reason: 'missing_token' };
    }

  const a = Buffer.from(providedHeader);
    const b = Buffer.from(expectedSecret);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
          return { ok: false, status: 401, reason: 'invalid_token' };
    }
    return { ok: true };
}

export function parseUpdateJson(raw: string):
    | { ok: true; value: unknown }
  | { ok: false; status: 400; reason: 'malformed_json' } {
    try {
          return { ok: true, value: JSON.parse(raw) };
    } catch {
          return { ok: false, status: 400, reason: 'malformed_json' };
    }
}

/** Optional helper if you ever need a derived probe value without exposing the secret. */
export function secretFingerprint(secret: string): string {
    return createHmac('sha256', 'nest-telegram-kit').update(secret).digest('hex').slice(0, 12);
}
