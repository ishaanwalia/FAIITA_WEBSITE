import type { NavItem } from "@/types";

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Vision & Mission", href: "/about/vision-mission", description: "What we stand for and where we're headed" },
      { label: "About FAIITA", href: "/about/about-faiita", description: "Our structure, history and how the federation works" },
      { label: "State Associations", href: "/about/state-associations", description: "29 states, one federated network" },
      { label: "Member Associations", href: "/about/member-associations", description: "Associations affiliated under FAIITA" },
    ],
  },
  { label: "Leadership", href: "/about/leadership" },
  {
    label: "Resources",
    children: [
      { label: "News", href: "/resources/news", description: "Announcements and federation updates" },
      { label: "Events", href: "/resources/events", description: "Summits, AGMs and workshops" },
      { label: "Blogs", href: "/resources/blogs", description: "Perspectives from the IT trade ecosystem" },
      { label: "Gallery", href: "/resources/gallery", description: "Moments from across the federation" },
      { label: "Newsletter", href: "/resources/newsletter", description: "Our quarterly publication" },
      { label: "Policy", href: "/resources/policy", description: "Advocacy positions and guidance documents" },
    ],
  },
  { label: "Contact", href: "/contact" },
];
