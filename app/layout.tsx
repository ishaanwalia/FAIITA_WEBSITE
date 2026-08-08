import type { Metadata, Viewport } from "next";
import { Geist, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { jsonLd } from "@/lib/utils";

const display = Geist({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.faiita.co.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FAIITA — Federation of All India Information Technology Associations",
    template: "%s | FAIITA",
  },
  description:
    "FAIITA is the apex body uniting state-level IT associations across India, representing 50,000+ IT channel partners across 26 states since 2014.",
  keywords: [
    "FAIITA",
    "IT dealers India",
    "IT associations",
    "channel partners",
    "IT federation",
    "India IT trade",
  ],
  // Only site-level fields here. Setting og:title/og:description/og:url or
  // twitter:title/twitter:description at the root makes every child page
  // inherit them — which shipped a homepage og:url on all 60 pages, so a share
  // of /about/leadership told Facebook and LinkedIn it was the front page, and
  // every X card read "Uniting 50,000+ IT entrepreneurs…" whatever the page.
  // Left unset, Next derives og:* from each page's own title and description,
  // and twitter:* from og:*.
  openGraph: {
    siteName: "FAIITA",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    // favicon.jpg used to be listed here unqualified (no sizes/type) — a
    // 554x554, 36KB JPEG for a browser-tab icon, when this properly-sized
    // PNG already covers the same slot.
    icon: [{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0B1220",
  width: "device-width",
  initialScale: 1,
};

// No sameAs (social profile) links yet — FAIITA has no live social
// profiles to point to, so asserting any here would be worse than omitting
// the field. Add sameAs once real profile URLs exist.
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FAIITA — Federation of All India Information Technology Associations",
  alternateName: "FAIITA",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description:
    "FAIITA is the apex body uniting state-level IT associations across India, representing 50,000+ IT channel partners across 26 states since 2014.",
  foundingDate: "2014",
  contactPoint: [
    { "@type": "ContactPoint", email: "president@faiita.co.in", contactType: "president office" },
    {
      "@type": "ContactPoint",
      email: "secretary@faiita.co.in",
      telephone: "+91-9814958290",
      contactType: "customer service",
    },
  ],
};

// A @graph rather than two loose blocks, so `publisher` on every article and
// event page resolves to this same @id instead of a second, unrelated
// Organization node. Without the ids, each page asserted its own copy of
// FAIITA and nothing tied them together.
const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    { ...organizationSchema, "@context": undefined, "@id": `${siteUrl}/#organization` },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "FAIITA",
      inLanguage: "en-IN",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body>
        {/* type="application/ld+json" is a data block, not an executable
            script — CSP's script-src (see proxy.ts) doesn't govern it, so
            no nonce is needed here, and this stays a plain Server Component
            (no headers() call) so every page keeps its static/ISR caching. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(siteSchema) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
