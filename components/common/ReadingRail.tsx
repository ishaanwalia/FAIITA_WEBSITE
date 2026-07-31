"use client";

// Section rail: one dot per <h2> on the CURRENT page, the active one filled.
// Ported from github.com/ishaanwalia/megastar-law's ReadingRail — same
// two fixes as the original: re-reads on every route change (mounted once
// in the site layout, it would otherwise keep the previous page's headings
// on every other route), and clicking scrolls to the heading's own top with
// the fixed header's height subtracted, instead of landing under it.

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const HEADER_OFFSET = 104; // Navbar is a fixed 80px (h-20) bar + breathing room

export function ReadingRail({ scope = "main" }: { scope?: string }) {
  const pathname = usePathname();
  const [sections, setSections] = useState<{ id: string; text: string }[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    // Clearing state for the new route before the async rescan below repopulates
    // it — not syncing from external state, so this is a legitimate exception to
    // the "no setState in effect" rule (same as CinematicLoader/SmoothScroll).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSections([]);
    setActiveId("");
    let cleanup = () => {};

    // Headings mount with the route; yield once so the new page is in. A
    // macrotask, not rAF — rAF never fires in a backgrounded tab, which would
    // leave the rail permanently empty there.
    const timer = window.setTimeout(() => {
      const root = document.querySelector(scope);
      if (!root) return;
      const heads = [...root.querySelectorAll("h2")].filter((h) => (h.textContent || "").trim());
      heads.forEach((h, i) => {
        // Slug from the heading text, not the index: positional ids break
        // every existing deep link the moment a section is added or reordered.
        if (!h.id) {
          const slug = (h.textContent || "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
            .slice(0, 40);
          h.id = slug || `section-${i}`;
        }
        (h as HTMLElement).style.scrollMarginTop = `${HEADER_OFFSET}px`;
      });
      setSections(heads.map((h) => ({ id: h.id, text: h.textContent!.trim() })));

      // Recompute from ALL heading positions rather than trusting whichever
      // observer entry fired: with a narrow band, scrolling through a gap
      // where nothing intersects leaves the previous item stuck lit.
      const sync = () => {
        if (!heads.length) return;
        const line = HEADER_OFFSET + window.innerHeight * 0.2;
        let current = heads[0];
        for (const h of heads) {
          if (h.getBoundingClientRect().top <= line) current = h;
        }
        setActiveId(current.id);
      };
      sync();
      // Scroll listener drives the common case; the observer is the backstop
      // for programmatic jumps and any environment where scroll events are
      // frame-gated. Both call the same all-headings recompute, so they can
      // safely fire together.
      const io = new IntersectionObserver(sync, { threshold: [0, 0.5, 1] });
      heads.forEach((h) => io.observe(h));
      window.addEventListener("scroll", sync, { passive: true });
      window.addEventListener("resize", sync);
      cleanup = () => {
        io.disconnect();
        window.removeEventListener("scroll", sync);
        window.removeEventListener("resize", sync);
      };
    }, 0);

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, [scope, pathname]);

  const jump = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET,
      behavior: "smooth",
    });
  }, []);

  if (sections.length < 3) return null;

  return (
    <nav
      aria-label="On this page"
      className="pointer-events-none fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 xl:block"
    >
      <ul className="pointer-events-auto flex flex-col gap-3">
        {sections.map((s) => {
          const on = s.id === activeId;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => jump(s.id)}
                aria-current={on ? "true" : undefined}
                className="group flex cursor-pointer items-center gap-2.5 text-left"
              >
                <span
                  className={`h-px transition-all duration-300 ${
                    on ? "w-7 bg-saffron-500" : "w-3.5 bg-navy-700/20 group-hover:w-5"
                  }`}
                />
                <span
                  className={`max-w-44 truncate text-[11px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                    on ? "text-navy-800" : "text-muted-foreground"
                  }`}
                >
                  {s.text}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
