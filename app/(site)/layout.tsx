import { CinematicLoader } from "@/components/common/CinematicLoader";
import { SmoothScroll } from "@/components/common/SmoothScroll";
import { CustomCursor } from "@/components/common/CustomCursor";
import { ScrollProgress } from "@/components/common/ScrollProgress";
import { PageTransition } from "@/components/common/PageTransition";
import { BackToTop } from "@/components/common/BackToTop";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-saffron-500 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <CinematicLoader />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main id="main-content">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <BackToTop />
    </SmoothScroll>
  );
}
