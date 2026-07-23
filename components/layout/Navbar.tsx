"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";

function NavLinkReveal({ label, active }: { label: string; active?: boolean }) {
  return (
    <span className="relative block h-5 overflow-hidden">
      <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
        {label}
      </span>
      <span className="absolute left-0 top-full block transition-transform duration-300 ease-out group-hover:-translate-y-full text-saffron-400">
        {label}
      </span>
      {active && (
        <span className="absolute -bottom-1.5 left-0 h-[2px] w-full origin-left scale-x-100 bg-saffron-400" />
      )}
    </span>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [spotlit, setSpotlit] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Reset transient interaction state (open menus) on navigation — these
    // aren't derived from pathname, they're just closed by it, so there's no
    // cleaner alternative to resetting them here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Escape closes whichever nav surface is open; on the mobile panel it also
  // returns focus to the toggle button so keyboard users aren't left stranded.
  useEffect(() => {
    if (!mobileOpen && !openDropdown) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (mobileOpen) {
        setMobileOpen(false);
        mobileToggleRef.current?.focus();
      } else if (openDropdown) {
        setOpenDropdown(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, openDropdown]);

  // Focus trap for the mobile menu: move focus in on open, cycle Tab/Shift+Tab
  // within the panel while it's open so keyboard focus can't leave the
  // visible overlay onto content hidden behind it.
  useEffect(() => {
    if (!mobileOpen) return;
    const panel = mobilePanelRef.current;
    if (!panel) return;

    const getFocusable = () =>
      Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));

    getFocusable()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    panel.addEventListener("keydown", onKeyDown);
    return () => panel.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const openMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const isActive = (href?: string) => !!href && (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="fixed inset-x-0 top-0 z-50 isolate">
      <div
        className={cn(
          "[transform:translateZ(0)] will-change-transform transition-all duration-500",
          scrolled ? "glass-dark border-b shadow-lg shadow-black/10" : "bg-transparent border-b border-transparent"
        )}
      >
      <div className="container-page flex h-20 items-center justify-between">
        <Logo variant="light" />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary" onMouseLeave={() => setSpotlit(null)}>
          {navItems.map((item) => {
            const active = isActive(item.href) || (item.children?.some((c) => pathname.startsWith(c.href)) ?? false);
            return (
              <div
                key={item.label}
                className="group relative"
                onMouseEnter={() => {
                  setSpotlit(item.label);
                  if (item.children) openMenu(item.label);
                }}
                onMouseLeave={() => item.children && scheduleClose()}
              >
                {spotlit === item.label && (
                  <motion.div
                    layoutId="nav-spotlight"
                    className="absolute inset-0 rounded-full bg-white/10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}                {item.children ? (
                  <button
                    className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
                    aria-expanded={openDropdown === item.label}
                    aria-haspopup="true"
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  >
                    <NavLinkReveal label={item.label} active={active} />
                    <ChevronDown
                      className={cn("h-3.5 w-3.5 transition-transform duration-200", openDropdown === item.label && "rotate-180")}
                    />
                  </button>
                ) : (
                  <Link href={item.href!} className="block rounded-full px-4 py-2 text-sm font-medium text-white/90 hover:text-white">
                    <NavLinkReveal label={item.label} active={active} />
                  </Link>
                )}

                <AnimatePresence>
                  {item.children && openDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="glass-dark absolute left-1/2 top-full z-50 mt-2 w-80 -translate-x-1/2 overflow-hidden rounded-2xl shadow-2xl shadow-black/40"
                    >
                      <ul className="p-2">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="group/item flex flex-col gap-0.5 rounded-xl px-4 py-3 transition-colors hover:bg-white/10"
                            >
                              <span className="text-sm font-semibold text-white group-hover/item:text-saffron-400">
                                {child.label}
                              </span>
                              {child.description && <span className="text-xs text-white/50">{child.description}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <MagneticButton asChild variant="accent" size="default">
            <Link href="/contact">Join FAIITA</Link>
          </MagneticButton>
        </div>

        <button
          ref={mobileToggleRef}
          className="flex h-11 w-11 items-center justify-center rounded-full text-white lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={mobilePanelRef}
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-20 z-40 bg-navy-900 lg:hidden"
          >
            <motion.div
              className="container-page flex flex-col gap-2 py-10"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            >
              {navItems.map((item) => (
                <MobileNavGroup key={item.label} item={item} />
              ))}
              <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
                <MagneticButton asChild variant="accent" className="mt-4 w-full">
                  <Link href="/contact">Join FAIITA</Link>
                </MagneticButton>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileNavGroup({ item }: { item: (typeof navItems)[number] }) {
  const [open, setOpen] = useState(false);
  const variants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  if (!item.children) {
    return (
      <motion.div variants={variants}>
        <Link href={item.href!} className="block py-3 text-2xl font-display font-semibold text-white/90 hover:text-saffron-400">
          {item.label}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div variants={variants}>
      <button
        className="flex w-full items-center justify-between py-3 text-2xl font-display font-semibold text-white/90"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {item.label}
        <ChevronDown className={cn("h-5 w-5 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-3">
            {item.children.map((child) => (
              <Link key={child.href} href={child.href} className="block py-2 text-sm text-white/60 hover:text-white">
                {child.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
