import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FAIITA — Federation of All India Information Technology Associations",
    short_name: "FAIITA",
    description:
      "Uniting India's IT trade fraternity — 50,000+ IT channel partners across 26 states under one national federation.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B2A4A",
    theme_color: "#0B2A4A",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
