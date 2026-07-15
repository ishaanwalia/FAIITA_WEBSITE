import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const mono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
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
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#0B2A4A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
