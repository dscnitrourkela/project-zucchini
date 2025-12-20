import { NextRequest } from "next/server";
import { checkRateLimit, type RateLimitConfig } from "./rate-limit";
import { getUserFromToken } from "@repo/firebase-config/admin";

export interface AuthResult {
  uid: string;
  email: string | undefined;
}

export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  const authHeader = request.headers.get("Authorization");
  const user = await getUserFromToken(authHeader);
  if (!user) {
    throw new AuthError("Invalid or missing authentication token");
  }

  return {
    uid: user.uid,
    email: user.email,
  };
}

export async function optionalAuth(request: NextRequest): Promise<AuthResult | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return null;

  const user = await getUserFromToken(authHeader);
  if (!user) return null;

  return {
    uid: user.uid,
    email: user.email,
  };
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0] || realIp || "unknown";
}

export function applyRateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  prefix: string = ""
): void {
  const clientId = getClientIdentifier(request);
  const key = `${prefix}:${clientId}`;
  const result = checkRateLimit(key, config);

  if (!result.success) {
    throw new RateLimitError("Too many requests, please try again later");
  }
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}
