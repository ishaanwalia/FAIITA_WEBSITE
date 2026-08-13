import { CinematicLoader } from "@/components/common/CinematicLoader";
import { SmoothScroll } from "@/components/common/SmoothScroll";
import { ScrollReset } from "@/components/common/ScrollReset";
import { CustomCursor } from "@/components/common/CustomCursor";
import { PageTransition } from "@/components/common/PageTransition";
import { BackToTop } from "@/components/common/BackToTop";
import { ReadingRail } from "@/components/common/ReadingRail";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <ScrollReset />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-md focus:bg-navy-800 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <CinematicLoader />
      <CustomCursor />
      <Navbar />
      <ReadingRail />
      {/* -mt-20 cancels the flow-height the sticky header (see Navbar.tsx)
          now reserves, so every page's content still starts at y=0 with the
          header floating transparently over it — the same look `position:
          fixed` gave for free, just achieved from a header that's back in
          normal document flow. */}
      <main id="main" className="-mt-20">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <BackToTop />
    </SmoothScroll>
  );
}
