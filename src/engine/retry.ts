export function calculateBackoff(attempt: number, baseDelay = 1000): number {
  return Math.pow(2, attempt) * baseDelay;
}

export function shouldRetry(status: string, maxAttempts: number, attempts: number): boolean {
  return status === 'failed' && attempts < maxAttempts;
}