import { NextResponse, type NextRequest } from "next/server";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 8;
// /admin/login is here because the login server action POSTs to that URL, so
// the same counter that stops contact-form spam also caps password guessing.
const RATE_LIMITED_PATHS = ["/api/contact", "/api/newsletter", "/admin/login"];

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

  // --- Accepted risk: 'unsafe-inline' on script-src and style-src ---------
  // Formally re-evaluated 2026-07-30 against Next's own documented nonce
  // pattern (headers()/connection() + <Script nonce>) — still not adopting
  // it, for two independent reasons:
  //
  // 1. It doesn't actually work here. Verified in production: Next's own
  //    inline hydration/RSC-payload scripts do not pick up a nonce from this
  //    header the way the docs imply — they ship with no nonce attribute at
  //    all, so a strict-dynamic policy blocks them outright and the site
  //    renders a blank white screen (everything Framer Motion sets to
  //    opacity:0 for its initial animation state never animates back in,
  //    because the JS that would do that never runs). The <Script nonce>
  //    prop only covers scripts *we* render via next/script — not Next's own
  //    framework-injected ones — so this isn't fixable from application code.
  // 2. Even ignoring (1), a nonce is per-request by construction — Next
  //    requires forcing every page to dynamic rendering to generate one.
  //    That's the exact static/ISR caching this site deliberately protects
  //    (see the JSON-LD comment in app/layout.tsx) traded away site-wide, for
  //    a page that renders no user-generated or unescaped third-party
  //    content — there's no realistic injection point for the stricter
  //    policy to actually stop.
  //
  // style-src has the same shape of problem for a smaller reason: 16
  // `style={{...}}` usages across 10 components render as literal inline
  // style attributes, which style-src 'unsafe-inline' is what permits.
  //
  // Revisit if either changes: (a) Next ships first-class nonce support for
  // its own inline scripts, or (b) this site starts rendering any
  // user-submitted or third-party HTML/markdown without server-side escaping
  // — that's the scenario where 'unsafe-inline' actually matters.
  const csp = [
    `default-src 'self'`,
    // 'unsafe-eval' is dev-only: React's development build uses eval() for
    // callstack reconstruction, and without it hydration dies on localhost —
    // the page renders but nothing is interactive. Never sent in production.
    `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
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
