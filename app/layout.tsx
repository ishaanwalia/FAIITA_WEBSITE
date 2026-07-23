import type { Metadata, Viewport } from "next";
import { Geist, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

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
  openGraph: {
    title: "FAIITA — Federation of All India Information Technology Associations",
    description: "Uniting 50,000+ IT entrepreneurs across 26 states under one national federation.",
    url: siteUrl,
    siteName: "FAIITA",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAIITA — Federation of All India Information Technology Associations",
    description: "Uniting 50,000+ IT entrepreneurs across 26 states under one national federation.",
  },
  icons: {
    icon: [
      { url: "/favicon.jpg" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0B2A4A",
  width: "device-width",
  initialScale: 1,
};

// No sameAs (social profile) links yet — the Footer's social icons are
// still placeholders pointing nowhere, so asserting them here as FAIITA's
// official profiles would be worse than omitting the field. Add sameAs
// once real profile URLs exist.
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
