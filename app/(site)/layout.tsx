import { CinematicLoader } from "@/components/common/CinematicLoader";
import { SmoothScroll } from "@/components/common/SmoothScroll";
import { ScrollReset } from "@/components/common/ScrollReset";
import { CustomCursor } from "@/components/common/CustomCursor";
import { ScrollProgress } from "@/components/common/ScrollProgress";
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
      <ScrollProgress />
      <Navbar />
      <ReadingRail />
      <main id="main">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <BackToTop />
    </SmoothScroll>
  );
}
