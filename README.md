# FAIITA — Official Website

Production codebase for the Federation of All India Information Technology
Associations, built with Next.js 16 (App Router), TypeScript, Tailwind CSS,
Prisma, and Framer Motion.

---

## 1. Local development

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env
# .env already defaults to a local SQLite file — no external DB needed to start

# 3. Create the local database + tables
npm run db:push

# 4. Seed placeholder content (states, news, events, testimonials...)
npm run db:seed

# 5. Run the dev server
npm run dev
```

Visit `http://localhost:3000`.

> **Add your logo:** drop a transparent-background file at `public/logo.png`
> (or `.svg`, updating the `src` in `components/common/Logo.tsx`). Until then,
> a styled "F" wordmark is shown automatically so nothing breaks.

---

## 2. GitHub setup

```bash
cd faiita-website
git init
git add .
git commit -m "Initial commit — FAIITA production website"

# Create a new empty repo on github.com first, then:
git branch -M main
git remote add origin https://github.com/<your-org>/faiita-website.git
git push -u origin main
```

Recommended repo settings:
- Protect `main` branch, require PRs before merging.
- Enable Dependabot alerts (Settings → Code security).

---

## 3. Database setup for production (free tier)

SQLite (used locally) does **not** work reliably on Vercel's serverless
environment — the filesystem is ephemeral and not shared across function
instances. Switch to a hosted Postgres database before going live. Both
options below have generous free tiers; **Neon** is the simplest if you're
deploying on Vercel.

### Option A — Neon (recommended)

1. Go to https://neon.tech → sign up (free) → **Create a project**.
2. Once created, open **Connection Details** and copy:
   - the **pooled** connection string → this becomes `DATABASE_URL`
   - the **direct** connection string → this becomes `DIRECT_URL`
3. In `prisma/schema.prisma`, update the datasource block:

   ```prisma
   datasource db {
     provider  = "postgresql"
     url       = env("DATABASE_URL")
     directUrl = env("DIRECT_URL")
   }
   ```

4. Locally, update `.env` with the Neon connection strings and run:

   ```bash
   npm run db:migrate   # creates tables on Neon using a proper migration
   npm run db:seed      # loads placeholder content — replace with real data after
   ```

### Option B — Supabase

1. Go to https://supabase.com → sign up (free) → **New project**.
2. Project Settings → Database → copy the **Connection string** (URI, use the
   "Transaction" pooler on port 6543 for `DATABASE_URL`, and the "Session"
   connection on port 5432 for `DIRECT_URL`).
3. Follow the same schema update and `db:migrate` / `db:seed` steps as above.

Either way, once your production database is live, add `DATABASE_URL` (and
`DIRECT_URL`, if used) to Vercel's environment variables (see below) — do
**not** commit real credentials to `.env`.

---

## 4. Deploying to Vercel

1. Go to https://vercel.com/new and import your GitHub repository.
2. Framework preset: **Next.js** (auto-detected).
3. Add Environment Variables (Project Settings → Environment Variables):

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | your Neon/Supabase pooled connection string |
   | `DIRECT_URL` | your Neon/Supabase direct connection string |
   | `NEXT_PUBLIC_SITE_URL` | `https://www.faiita.co.in` |
   | `RESEND_API_KEY` | (optional) from https://resend.com for contact-form emails |
   | `CONTACT_TO_EMAIL` | secretary@faiita.co.in |

4. Deploy. The `build` script (`prisma generate && next build`) handles
   Prisma client generation automatically.
5. After the first deploy, run the migration against production once from
   your local machine (with `.env` pointed at the production DB):

   ```bash
   npm run db:migrate
   npm run db:seed   # optional — only if you want placeholder data live
   ```

6. **Connect your domain:** Project Settings → Domains → add
   `faiita.co.in` and `www.faiita.co.in`, then update your DNS records
   (Vercel shows the exact A/CNAME records to add) at your domain registrar.
   Once DNS propagates, this replaces both the old site and the
   `faiita-website.vercel.app` test deployment.

---

## 5. Replacing placeholder content

The seed script (`prisma/seed.ts`) fills every model with realistic
placeholder data so the site works out of the box. Before launch, replace:

- State association president/secretary names, phone numbers (marked
  `REPLACE ME`), and exact member counts.
- The national Leadership roster (`leaders` array).
- News, events, blogs, gallery images, newsletters, and policy documents —
  either edit `prisma/seed.ts` and re-run `npm run db:seed`, or connect a
  simple admin flow / edit rows directly via `npm run db:studio` (Prisma
  Studio — a visual database editor).

---

## 6. Useful scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build (also runs `prisma generate`) |
| `npm run db:push` | Sync schema to DB without a migration (good for local SQLite) |
| `npm run db:migrate` | Create a tracked migration (use for Postgres/production) |
| `npm run db:seed` | Load placeholder content |
| `npm run db:studio` | Open Prisma Studio to browse/edit data visually |

---

## 7. Project structure

```
app/
  (site)/            → all public pages (share Navbar + Footer + loader)
  api/contact/        → contact form submission endpoint
  sitemap.ts, robots.ts, not-found.tsx  → SEO + error handling
components/
  layout/            → Navbar, Footer
  home/              → homepage sections
  about/             → IndiaMap, Leadership
  common/            → Logo, CinematicLoader, SectionHeading, ContactForm
  ui/                → shadcn-style primitives (Button, Card, Badge)
lib/                 → prisma client, nav config, utils
prisma/              → schema.prisma, seed.ts
types/               → shared TypeScript types
```
