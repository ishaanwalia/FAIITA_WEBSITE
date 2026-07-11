export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavItem = {
  label: string;
  href?: string;
  children?: NavLink[];
};

export type StatItem = {
  id: string;
  label: string;
  value: string;
  suffix: string | null;
  icon: string | null;
};

export type TestimonialItem = {
  id: string;
  name: string;
  role: string;
  association: string;
  quote: string;
  imageUrl: string | null;
};

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string | null;
  isDemo: boolean;
  publishedAt: Date;
};

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  city: string;
  state: string;
  startDate: Date;
  coverImage: string | null;
  isDemo: boolean;
};

export type StateMapPoint = {
  id: string;
  slug: string;
  stateName: string;
  stateCode: string;
  region: string;
  associationName: string;
  memberCount: number;
  foundedYear: number | null;
  presidentName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  logoUrl: string | null;
  mapX: number;
  mapY: number;
};