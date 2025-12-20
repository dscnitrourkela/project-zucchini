import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS } from "@repo/shared-utils/server";

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0] || realIp || "unknown";
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const clientId = getClientIdentifier(request);
  const key = `admin:${clientId}`;
  const result = checkRateLimit(key, RATE_LIMITS.AUTH);

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
