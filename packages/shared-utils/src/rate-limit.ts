type RateLimitEntry = {
  count: number;
  resetTime: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL = 60 * 1000;
let lastCleanup = Date.now();

function cleanup(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

export function checkRateLimit(identifier: string, config: RateLimitConfig): RateLimitResult {
  cleanup();

  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      success: true,
      remaining: config.limit - 1,
      resetTime: now + config.windowMs,
    };
  }

  if (entry.count >= config.limit) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: config.limit - entry.count,
    resetTime: entry.resetTime,
  };
}

export const RATE_LIMITS = {
  REGISTRATION: { limit: 5, windowMs: 60 * 1000 },
  PAYMENT: { limit: 10, windowMs: 60 * 1000 },
  CHECK: { limit: 30, windowMs: 60 * 1000 },
  UPLOAD: { limit: 10, windowMs: 60 * 1000 },
  AUTH: { limit: 10, windowMs: 60 * 1000 },
} as const;
