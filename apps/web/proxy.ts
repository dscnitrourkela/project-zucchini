import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS, type RateLimitConfig } from "@repo/shared-utils/server";

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0] || realIp || "unknown";
}

function getRateLimitConfig(pathname: string): { config: RateLimitConfig; prefix: string } | null {
  if (pathname.includes("/register")) {
    return { config: RATE_LIMITS.REGISTRATION, prefix: "register" };
  }
  if (pathname.includes("/check-registration") || pathname.includes("/check-cross-registration")) {
    return { config: RATE_LIMITS.CHECK, prefix: "check" };
  }
  if (
    pathname.includes("/initiate-order") ||
    pathname.includes("/intiate-order") ||
    pathname.includes("/verify-order")
  ) {
    return { config: RATE_LIMITS.PAYMENT, prefix: "payment" };
  }
  if (pathname.includes("/cloudinary-upload")) {
    return { config: RATE_LIMITS.UPLOAD, prefix: "upload" };
  }
  return null;
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const rateLimitInfo = getRateLimitConfig(pathname);
  if (!rateLimitInfo) {
    return NextResponse.next();
  }

  const clientId = getClientIdentifier(request);
  const key = `${rateLimitInfo.prefix}:${clientId}`;
  const result = checkRateLimit(key, rateLimitInfo.config);

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: "Too many requests, please try again later" },
      { status: 429 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
