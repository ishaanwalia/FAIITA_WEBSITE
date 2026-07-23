import { NextResponse, type NextRequest } from "next/server";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 8;
const RATE_LIMITED_PATHS = ["/api/contact", "/api/newsletter"];

// In-memory only — resets on cold start and isn't shared across serverless
// instances, so it's a first line of defense against casual scripted spam,
// not a hardened rate limiter. Move to a shared store (e.g. Upstash Redis)
// if abuse persists at scale.
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (request.method === "POST" && RATE_LIMITED_PATHS.some((p) => pathname.startsWith(p))) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(`${pathname}:${ip}`)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }
  }

  // NOT nonce-based: verified in production that Next's own inline
  // hydration/RSC-payload scripts do not automatically pick up a nonce from
  // this header the way the docs suggest — they shipped with no nonce
  // attribute at all, so the browser blocked every one of them and the site
  // rendered a blank white screen (everything Framer Motion sets to
  // opacity:0 for its initial animation state never got animated back in,
  // because the JS that would do that never ran). 'unsafe-inline' for
  // script-src is a real, deliberate tradeoff for a site that ships this
  // much first-party inline script — reliability over a stricter policy
  // this setup can't currently support without deeper surgery.
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https://images.unsplash.com https://*.public.blob.vercel-storage.com`,
    `font-src 'self'`,
    `connect-src 'self' https://vitals.vercel-insights.com`,
    // Newsletter issues embed Heyzine's flip-book viewer in an <iframe> —
    // without this, frame-src falls back to default-src 'self' and silently
    // blocks it.
    `frame-src 'self' https://heyzine.com`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'self'`,
  ].join("; ");

  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
