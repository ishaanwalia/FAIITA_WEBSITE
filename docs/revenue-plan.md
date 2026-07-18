# FAIITA Website — Revenue Generation & Member Product Showcase Plan

_Drafted 18 July 2026. Status: proposal — nothing here is built yet._

## 1. Revenue streams (ranked by effort vs. return)

1. **Member Product Showcase** — paid ad slots on the homepage where members
   promote their unique products (detailed in section 2). Fastest to launch:
   the audience and the sellers are the same community.
2. **Vendor / OEM sponsorship** — national distributors and brands (components,
   laptops, UPS, networking) pay for a homepage banner or "Supported by"
   placement. These companies already sponsor association events and diaries;
   ₹15,000–50,000/quarter is realistic for a named brand.
3. **Sponsored news posts** — a vendor's product launch or channel scheme
   published as a tagged "Partner Update" in the News section.
   ₹2,000–3,000 per post; near-zero effort since the news pipeline exists.
4. **Digital annual diary / directory** — FAIITA already produces a print
   diary. A web/PDF edition with ad pages mirrors the model members know.
   Print diary ads in Indian trade associations run ₹10,000–50,000/page;
   price the digital page at 30–50% of that.
5. **Newsletter / WhatsApp blast sponsorship** — real reach is the 50,000+
   channel partners via state association WhatsApp groups. Bundle
   "forwarded to all state associations" with a website slot.
6. **Premium member profile pages** — the leader-profiles "digital visiting
   card" infrastructure already exists; offer the same rich profile to any
   member for ₹500–1,000/year. Small price, scales across thousands.
7. **Later** — B2B classifieds (dealer-to-dealer stock clearance, distributor
   offers) and event ticketing, once traffic grows.

## 2. Member Product Showcase — section spec

**Placement:** homepage, between `<NewsSection />` and `<EventsSection />`
in `app/(site)/page.tsx`.

**Layout** (matching the site's design language):

- Section header: eyebrow "Member Showcase", heading "Products from Our
  Members", small "Sponsored" chip for transparency.
- One **featured video slot** (larger card, muted autoplay loop, ≤30s) plus a
  **carousel of up to 6 photo cards** (auto-scrolling marquee, pauses on
  hover).
- Each card: member's graphic (16:9, `object-contain` — never crop), member /
  firm name, association chip, CTA button (WhatsApp or website link).
- Final card: "Advertise your product here →" linking to the contact page.
- Empty state: 2–3 placeholder cards using the existing `DemoBadge` pattern so
  the section markets itself from day one.

**Content management:** code-side `lib/showcase.ts` (same pattern as
`lib/member-associations.ts`) — each entry has `image/videoUrl, memberName,
association, link, startDate, endDate`. Ads auto-hide after `endDate`; no
manual takedowns, no DB reseed. Assets in `/public/showcase/`.

**Workflow:** member sends graphic + payment screenshot to the Secretary on
WhatsApp → entry added to `lib/showcase.ts` → push → live in minutes.

**Asset rules for members:**

- Photo: 1200×675, JPG/PNG, under 500 KB.
- Video: 1080p, max 30 seconds, MP4 under 10 MB, must work muted.

## 3. Rate card (launch pricing)

Basis: the site is new (traffic likely low-thousands of visits/month). Members
are buying **federation endorsement + a targeted B2B trade audience + the
WhatsApp forwarding multiplier**, not raw impressions. Benchmarks: niche
Indian B2B site banners ₹2,000–10,000/month; association souvenir print pages
₹10,000–50,000; sponsored posts on trade portals ₹1,500–5,000.

| Slot                                       | Member rate                  | Notes                          |
| ------------------------------------------ | ---------------------------- | ------------------------------ |
| Photo card (1 of 6)                        | ₹2,000/month · ₹5,000/qtr    | Quarter = ~1 month free        |
| Featured video (only 1)                    | ₹5,000/month · ₹12,000/qtr   | Exclusivity justifies 2.5×     |
| Add-on: WhatsApp blast to all associations | +₹1,000/insertion            | Highest perceived value        |
| Non-member / vendor rate                   | 2× member rate               | Protects membership value      |
| Launch offer                               | 50% off first month, first 6 | Seeds the section fast         |

Fully sold ≈ **₹17,000/month (~₹2 lakh/year)** from this section alone,
before vendor banners or sponsored posts.

**For the Treasurer / CA:** ad income may attract 18% GST if FAIITA is
GST-registered; payments via UPI to the federation account with a monthly
reconciliation sheet.

**Renewal driver:** basic click tracking (a `/api/click?ad=x` redirect that
counts outbound clicks) so advertisers can be told "your ad got N clicks this
month" — the difference between one-time and recurring revenue.

## 4. Rollout order

1. Build the section with placeholder "Advertise here" cards.
2. Circulate a one-page rate card (PDF) to the GB and state association heads.
3. Onboard first advertisers at launch pricing; add click tracking.
4. After 2–3 months of full slots, raise rates ~25% and pitch vendor/OEM
   banners as tier 2.
