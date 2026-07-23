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

  // Nonce-based script-src: Next.js reads the nonce back out of this CSP
  // header and applies it to its own internal hydration scripts automatically,
  // so no per-script wiring is needed elsewhere for first-party code. Inline
  // style attributes are left alone (style-src 'unsafe-inline') because
  // framer-motion/GSAP set `style="..."` directly on elements site-wide —
  // CSS injection is a much narrower attack surface than script injection.
  const nonce = btoa(crypto.randomUUID());
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}'`,
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

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
