# Fashion Bridge International

Premium B2B fashion export platform built with Next.js 15, TypeScript, Tailwind CSS, Supabase, and React Query.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Shadcn UI** (Radix primitives)
- **Framer Motion**
- **Supabase** (Database, Auth, Storage)
- **React Query** (TanStack Query)
- **Recharts** (Analytics)

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Admin Login

- URL: `/admin/login`
- Email: `admin@fashionbridge.com`
- Password: `admin123`

## Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor
3. Copy your project URL and keys to `.env.local`
4. Create a `media` storage bucket (public)

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public website pages
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/
│   ├── ui/                # Reusable UI primitives
│   ├── shared/            # Shared business components
│   ├── layout/            # Header, Footer
│   ├── animations/        # Framer Motion wrappers
│   ├── forms/             # Form components
│   └── admin/             # Admin-specific components
├── lib/
│   ├── services/          # Data access layer
│   ├── supabase/          # Supabase clients
│   ├── constants/         # Site config & constants
│   └── validations/       # Zod schemas
├── hooks/                 # React Query hooks
├── providers/             # Context providers
└── types/                 # TypeScript types
```

## Features

### Public Website
- Home, About, Products, Collections, Export Services, Contact, Buyer Inquiry
- Product search & filters (category, price, color, size)
- Hero slideshow, scroll animations, testimonial carousel
- Dark mode, multi-language & multi-currency selectors
- WhatsApp integration, Google Maps

### Admin Dashboard
- Secure authentication (Supabase Auth + demo mode)
- Dashboard overview with analytics charts
- Product CRUD with duplicate & bulk operations
- Collection, inquiry, and order management
- Media library, inventory tracking, export reports

## Environment Variables

See `.env.example` for all required variables.

## Deploy to GitHub Pages (live preview)

Live URL: **https://mryamaslam.github.io/fashion_bridge**

Every push to `master` runs `.github/workflows/github-pages.yml` and publishes the site. With Supabase secrets configured (below), the live site uses your **real database** — not mock data.

### Connect Supabase to GitHub Pages

1. GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add these **Repository secrets**:

| Secret | Value |
|--------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://kiwutmrfmjotazmmjhky.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | your `sb_publishable_...` key |

3. Supabase Dashboard → **Authentication** → **URL Configuration**:
   - **Site URL:** `https://mryamaslam.github.io/fashion_bridge`
   - **Redirect URLs:** `https://mryamaslam.github.io/fashion_bridge/**`

4. Push to `master` — Actions rebuilds with live Supabase data.

Without secrets, the site falls back to demo mock data.

### One-time GitHub setup

1. Repo → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions**
3. Push to `master` (or run the workflow manually from **Actions**)

Set repo homepage (**Settings** → **General** → **Website**) to:

```
https://mryamaslam.github.io/fashion_bridge
```

### Local GitHub Pages build

```bash
npm run build:github-pages
```

Output is in the `out/` folder. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in your shell before building for live data.

---

## Deploy to Vercel (optional — full SSR + API)

Live repo: [github.com/Mryamaslam/fashion_bridge](https://github.com/Mryamaslam/fashion_bridge)

### Auto-deploy from GitHub

1. Connect repo at [vercel.com/new](https://vercel.com/new) → import `Mryamaslam/fashion_bridge`
2. **Production branch:** `master` (not `main`)
3. Framework: **Next.js** (auto-detected)
4. Add environment variable:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://mryamaslam.github.io/fashion_bridge` (GitHub Pages) or your Vercel URL |

5. Every push to `master` triggers a new production deploy.

`vercel.json` in the repo forces deploys from the `master` branch.

### GitHub repo homepage

In GitHub → **Settings** → **General** → **Website**, set:

```
https://mryamaslam.github.io/fashion_bridge
```

### Manual Vercel deploy

```bash
npx vercel login
npm run deploy:vercel
```

### GitHub Actions (optional backup deploy)

If Vercel webhook misses a push, add these secrets in GitHub → Settings → Secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

The workflow `.github/workflows/vercel-deploy.yml` redeploys on every `master` push.

---

## Deploy to Netlify

The project includes `netlify.toml` and `@netlify/plugin-nextjs` for Next.js 16 SSR on Netlify.

### Option A — Netlify CLI (fastest)

1. Create a free account at [netlify.com](https://www.netlify.com)
2. Login in terminal:

```bash
npx netlify login
```

3. Link site and deploy:

```bash
npx netlify init
npm run deploy:netlify
```

`netlify init` creates/links a site on your Netlify account.  
`deploy:netlify` runs build + production deploy.

Preview deploy (staging URL):

```bash
npm run deploy:netlify:preview
```

### Option B — GitHub + Netlify Dashboard

1. Push this repo to GitHub
2. [Netlify Dashboard](https://app.netlify.com) → **Add new site** → **Import from Git**
3. Build settings (auto-detected):
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Plugin:** `@netlify/plugin-nextjs`
4. Add environment variables (Site settings → Environment variables):

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://your-site.netlify.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | (optional) Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (optional) Supabase anon key |

5. Deploy — every push to `main` auto-deploys.

### Demo mode on Netlify

Without Supabase env vars, the site runs in **demo mode** with mock data.  
Admin login: `admin@fashionbridge.com` / `admin123`

