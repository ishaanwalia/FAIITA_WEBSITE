import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { NewsletterForm } from "@/components/common/NewsletterForm";

const quickLinks = [
  { label: "About FAIITA", href: "/about" },
  { label: "State Associations", href: "/about/state-associations" },
  { label: "Member Associations", href: "/about/member-associations" },
  { label: "Leadership", href: "/about/leadership" },
  { label: "Contact", href: "/contact" },
];

const resourceLinks = [
  { label: "News", href: "/resources/news" },
  { label: "Events", href: "/resources/events" },
  { label: "Gallery", href: "/resources/gallery" },
  { label: "Newsletter", href: "/resources/newsletter" },
];

export function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <Logo variant="light" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/50">
            The apex body uniting state-level IT associations across India —
            representing 50,000+ channel partners across 26 states, formally
            federated since 2014.
          </p>
          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">Get our newsletter</p>
            <NewsletterForm />
          </div>
        </div>

        <FooterColumn title="Quick Links" links={quickLinks} />
        <FooterColumn title="Resources" links={resourceLinks} />

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-white">Contact Us</h2>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-saffron-400">President Office</p>
          <ul className="mt-2 space-y-2 text-sm text-white/50">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-saffron-400" />
              <span>Navin Gupta — 01, Boring Road, Patna 800001</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-saffron-400" />
              <span>
                <a href="tel:+919334715522" className="hover:text-white">9334715522</a>
                {", "}
                <a href="tel:+919709401552" className="hover:text-white">9709401552</a>
              </span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-saffron-400" />
              <a href="mailto:president@faiita.co.in" className="hover:text-white">president@faiita.co.in</a>
            </li>
          </ul>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-saffron-400">Secretary Office</p>
          <ul className="mt-2 space-y-2 text-sm text-white/50">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-saffron-400" />
              <span>Sanjeev Walia — SCO-12, 1st Floor, Sector-17/E, Chandigarh 160017 (U.T.)</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-saffron-400" />
              <a href="tel:+919814958290" className="hover:text-white">9814958290</a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-saffron-400" />
              <a href="mailto:secretary@faiita.co.in" className="hover:text-white">secretary@faiita.co.in</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} FAIITA. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-white">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm text-white/50">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="link-underline hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
