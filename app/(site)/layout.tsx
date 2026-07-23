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
      <CinematicLoader />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <BackToTop />
    </SmoothScroll>
  );
}
