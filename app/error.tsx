"use client";

import { useEffect } from "react";

// Root-level boundary — catches errors the root layout itself can't recover
// from (unlike app/(site)/error.tsx, which only covers the site route group).
// Per Next.js convention this replaces the whole document when triggered, so
// it needs its own <html>/<body>.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en-IN">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
            fontFamily: "system-ui, sans-serif",
            background: "#F5F6F8",
            color: "#0B2A4A",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Something went wrong</h1>
          <p style={{ marginTop: "0.75rem", color: "#5B6472", maxWidth: "32rem" }}>
            We hit an unexpected error loading FAIITA&apos;s site. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "2rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "999px",
              border: "none",
              background: "#F2921D",
              color: "#0B2A4A",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
