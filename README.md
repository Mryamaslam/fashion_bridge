# Fashion Bridge International

Premium B2B fashion export platform built with Next.js 15, TypeScript, Tailwind CSS, MongoDB, and React Query.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Shadcn UI** (Radix primitives)
- **Framer Motion**
- **MongoDB** (Database), custom JWT admin auth, **Cloudinary** (media storage)
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

## MongoDB + Cloudinary Setup

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas), then Database → Connect → Drivers to get the connection string
2. Create a free account at [cloudinary.com](https://cloudinary.com) and copy Cloud Name / API Key / API Secret from the dashboard
3. Copy `.env.example` to `.env.local` and fill in `MONGODB_URI`, `AUTH_SECRET` (any long random string), and the `CLOUDINARY_*` values
4. Create the first admin login:

```bash
npm run create-admin -- --email you@example.com --password "YourPassword"
```

Without `MONGODB_URI` set, the site runs in **demo mode** with mock data and the login `admin@fashionbridge.com` / `admin123`.

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
│   ├── mongodb/           # MongoDB client & serialization
│   ├── auth/              # Admin session (JWT) & password hashing
│   ├── cloudinary/        # Media upload/delete
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
- Secure authentication (MongoDB + JWT sessions, or demo mode)
- Dashboard overview with analytics charts
- Product CRUD with duplicate & bulk operations
- Collection, inquiry, and order management
- Media library, inventory tracking, export reports

## Environment Variables

See `.env.example` for all required variables.

## Deploy to GitHub Pages (live preview)

Live URL: **https://mryamaslam.github.io/fashion_bridge**

Every push to `master` runs `.github/workflows/github-pages.yml` and publishes the site. **GitHub Pages is a static export with no server**, so it always shows demo mock data — MongoDB can't be queried safely from a static page (it would expose database credentials in the browser). The live database only powers the Vercel deployment below.

### One-time GitHub setup

1. Repo → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions** (not "Deploy from a branch")
3. Push to `master` (or **Actions** → **Deploy to GitHub Pages** → **Run workflow**)
4. First deploy: open the workflow run → approve **github-pages** environment if prompted
5. Wait 2–3 minutes, then open: https://mryamaslam.github.io/fashion_bridge/

### Local GitHub Pages build

```bash
npm run build:github-pages
```

Output is in the `out/` folder.

---

## Deploy to Vercel (optional — full SSR + API)

Live repo: [github.com/Mryamaslam/fashion_bridge](https://github.com/Mryamaslam/fashion_bridge)

### Auto-deploy from GitHub

1. Connect repo at [vercel.com/new](https://vercel.com/new) → import `Mryamaslam/fashion_bridge`
2. **Production branch:** `master` (not `main`)
3. Framework: **Next.js** (auto-detected)
4. Add environment variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | your Vercel URL |
| `MONGODB_URI` | your MongoDB Atlas connection string |
| `MONGODB_DB_NAME` | `fashion_bridge` |
| `AUTH_SECRET` | same long random string as `.env.local` |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | from your Cloudinary dashboard |

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
| `MONGODB_URI` | (optional) MongoDB Atlas connection string |
| `AUTH_SECRET` | (optional) same random string as `.env.local` |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | (optional) from your Cloudinary dashboard |

5. Deploy — every push to `main` auto-deploys.

### Demo mode on Netlify

Without `MONGODB_URI` set, the site runs in **demo mode** with mock data.  
Admin login: `admin@fashionbridge.com` / `admin123`

