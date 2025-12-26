import { generateIdempotencyKey } from '../src/engine/idempotency';

describe('Idempotency', () => {
  it('should generate unique keys', () => {
    const key1 = generateIdempotencyKey();
    const key2 = generateIdempotencyKey();

    expect(key1).not.toBe(key2);
    expect(key1).toHaveLength(32); // hex string of 16 bytes
    expect(key2).toHaveLength(32);
  });
});