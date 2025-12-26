import crypto from 'crypto';

export function generateIdempotencyKey(): string {
  return crypto.randomBytes(16).toString('hex');
}