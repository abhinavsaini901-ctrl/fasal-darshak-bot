// Auto-retry helper for RATE_LIMITED errors with exponential backoff.
// Keeps the UX smooth so users don't see the "too many requests" error
// unless the server is genuinely overloaded after several attempts.

export type RetryOpts = {
  retries?: number;      // number of retries (in addition to first try)
  baseMs?: number;       // initial backoff
  onRetry?: (attempt: number, waitMs: number) => void;
};

export async function withRateLimitRetry<T>(
  fn: () => Promise<T>,
  opts: RetryOpts = {},
): Promise<T> {
  const retries = opts.retries ?? 3;
  const baseMs = opts.baseMs ?? 1500;

  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      const msg = (e as Error)?.message ?? "";
      const isRateLimit = msg === "RATE_LIMITED" || msg.includes("429");
      if (!isRateLimit || attempt === retries) throw e;
      // Exponential backoff with jitter: 1.5s, 3s, 6s (+/- 400ms)
      const wait = baseMs * Math.pow(2, attempt) + Math.floor(Math.random() * 400);
      opts.onRetry?.(attempt + 1, wait);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}
