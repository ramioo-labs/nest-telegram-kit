import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseUpdateJson, validateWebhookSecret } from '../src/telegram/webhook-auth';

describe('validateWebhookSecret', () => {
    it('accepts matching token', () => {
          const r = validateWebhookSecret('s3cret', 's3cret');
          assert.equal(r.ok, true);
    });

           it('rejects missing header', () => {
                 const r = validateWebhookSecret(undefined, 's3cret');
                 assert.equal(r.ok, false);
                 if (!r.ok) {
                         assert.equal(r.status, 401);
                         assert.equal(r.reason, 'missing_token');
                 }
           });

           it('rejects wrong token', () => {
                 const r = validateWebhookSecret('nope', 's3cret');
                 assert.equal(r.ok, false);
                 if (!r.ok) {
                         assert.equal(r.status, 401);
                         assert.equal(r.reason, 'invalid_token');
                 }
           });

           it('fails closed when expected secret missing', () => {
                 const r = validateWebhookSecret('s3cret', undefined);
                 assert.equal(r.ok, false);
                 if (!r.ok) assert.equal(r.status, 401);
           });
});

describe('parseUpdateJson', () => {
    it('parses valid json', () => {
          const r = parseUpdateJson('{"update_id":1}');
          assert.equal(r.ok, true);
    });

           it('rejects malformed json', () => {
                 const r = parseUpdateJson('{not-json');
                 assert.equal(r.ok, false);
                 if (!r.ok) {
                         assert.equal(r.status, 400);
                         assert.equal(r.reason, 'malformed_json');
                 }
           });
});
