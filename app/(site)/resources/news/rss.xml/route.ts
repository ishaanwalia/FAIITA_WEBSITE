import { prisma } from "@/lib/prisma";
import { mergeNews } from "@/lib/code-news";

export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.faiita.co.in";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const dbNews = await prisma.news.findMany({ where: { isDemo: false } });
  const items = mergeNews(dbNews);

  const feedItems = items
    .slice(0, 30)
    .map(
      (n) => `
    <item>
      <title>${escapeXml(n.title)}</title>
      <link>${siteUrl}/resources/news/${n.slug}</link>
      <guid>${siteUrl}/resources/news/${n.slug}</guid>
      <pubDate>${n.publishedAt.toUTCString()}</pubDate>
      <description>${escapeXml(n.excerpt)}</description>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>FAIITA News</title>
    <link>${siteUrl}/resources/news</link>
    <description>The latest news and announcements from FAIITA — Federation of All India Information Technology Associations.</description>
    <language>en-in</language>${feedItems}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
