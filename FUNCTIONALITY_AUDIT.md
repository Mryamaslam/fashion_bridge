# Fashion Bridge International — Functionality Audit

> **Update (2026-08-12):** The items below marked ❌/⚠️ for Order management, Collections
> management, Media Library, Dashboard/Analytics real data, the inquiry-status persistence bug,
> contact-form persistence, and the currency conversion have since been fixed — see commit history.
> The language selector was removed rather than implemented. This document is kept as-is below for
> historical reference of what the gaps were and how they were verified.

Tested locally (dev server + live browser walkthrough) and verified against source. Legend: ✅ Working · ⚠️ Partial / caveat · ❌ Not implemented (stub or no-op).

## Public Site

| Feature | Status | Notes |
|---|---|---|
| Home, About, Export Services, Privacy, Terms | ✅ | Render correctly. Copy is static marketing text, not admin-editable — expected for these page types. |
| Products list (search + category filter, pagination) | ✅ | Real data — 240 SKUs, 8 categories, pagination works. |
| **Price / color / size filters** | ❌ | Backend filter logic (`product-filters.ts`) supports `minPrice`, `maxPrice`, `colors`, `sizes`, but the products page UI only renders a search box and category chips. README claims "search & filters (category, price, color, size)" — 3 of 4 are dead code, not reachable from the UI. |
| Product detail page | ✅ | Correct data, colorways, sizes, 404 on bad slug. |
| Collections list + detail | ✅ | Real data. |
| Cart | ✅ | Client-side, `localStorage`-backed guest cart. Works, but not tied to an account (fine for B2B guest flow). |
| Checkout → order creation | ⚠️ | Creates a real order and **immediately deducts stock** in Supabase mode. **No payment step anywhere** — no Stripe/PayPal, no payment field in the schema. This is a quote/reservation flow, not e‑commerce checkout — should be described to buyers as such, since stock is committed with $0 collected. |
| Contact form | ❌ | Submits successfully but the API route only pushes into an in-memory array — never written to Supabase, no email sent, lost on server restart. There is also **no admin inbox** to ever read these messages. |
| Buyer inquiry form | ✅ | Actually persisted to Supabase `inquiries` table (when configured) and visible in admin. |
| Multi-language selector | ❌ | Verified live: switching English → Español only changes the "EN"/"ES" label in the header. No translation happens anywhere — all page copy stays in English. No i18n library or dictionary exists in the codebase. |
| Multi-currency selector | ❌ (misleading) | Verified live: switching USD → EUR relabels every price with a € sign but keeps the exact same number (e.g. $4.41 → €4.41). There is no exchange-rate conversion. This actively misquotes price to a buyer who assumes it converted. |
| Dark mode | ✅ | Works correctly. |
| WhatsApp link | ✅ | Real `wa.me` deep link (click-to-chat), not an embedded widget — worth knowing which "integration" was meant. |
| Google Maps | ⚠️ | Real embedded map, but falls back to a hardcoded placeholder address (New York) that doesn't match the site's stated address unless an env var is set. |
| Language/currency choice persistence | ❌ | Plain `useState`, no `localStorage`/cookie. Selection resets on every page reload or navigation. |

## Admin Dashboard

Login tested both ways: with Supabase configured (current `.env.local`), the documented demo credentials (`admin@fashionbridge.com` / `admin123`) **fail** with "Invalid email or password" — they only work when Supabase env vars are absent (true demo mode). Anyone deploying with real Supabase configured should not expect the README's demo login to work, and no real admin account is seeded anywhere (`scripts/seed-supabase.ts` never creates one).

| Feature | Status | Notes |
|---|---|---|
| Auth (Supabase mode) | ✅ | Real `supabase.auth.signInWithPassword`. |
| Auth (demo mode) | ✅ | Hardcoded credential check, sets an httpOnly cookie. |
| Auth on `/api/admin/*` routes | ⚠️ | `requireAdmin()` returns "authorized" unconditionally when Supabase isn't configured — i.e. in demo mode the admin API routes have no real server-side auth check, only the login page gates access. |
| Dashboard stat tiles | ✅ | Real counts (products, collections, inquiries, revenue, orders, stock). |
| Revenue chart / Analytics page | ❌ | Entirely hardcoded to `mock.ts` chart data, in both demo and real Supabase mode. No real order data is ever aggregated into these charts. |
| Dashboard "Recent Orders" / "Recent Inquiries" panels | ❌ | Hardcoded to the same 3 mock orders / 4 mock inquiries regardless of mode — never reflects real records. |
| Products: CRUD, duplicate, CSV export | ✅ | Fully wired, tested — verified 240 real products loaded, create/edit/delete/duplicate all hit the real data layer. |
| Products: bulk operations | ❌ | No row selection / bulk delete / bulk status UI exists, despite README claim. |
| **Collections management** | ❌ | Verified live: page never calls any collections API. "Add Collection" writes only to an in-memory array in the browser tab — gone on refresh. **No edit or delete controls exist at all**, only a "View on site" link. |
| Inquiries: list + CSV export | ✅ | Real data. |
| Inquiries: status update | ⚠️ | In standard server mode, the PATCH route hardcodes the mock array instead of writing to Supabase — a status change looks like it worked (toast succeeds) but is not actually saved to the real database. |
| **Order management** | ❌ | Verified live: table always shows the same 3 hardcoded 2024 orders, never real orders placed through the storefront. Status-change dropdown only updates local component state — nothing is saved, and there is no API route to save it to (`/api/admin/orders` doesn't exist). |
| **Media library** | ❌ | Verified live: shows 4 fake hardcoded filenames with no real files behind them. "Upload" creates a browser-only blob URL that disappears when the tab closes — nothing reaches Supabase Storage, even though a real `media` bucket + RLS policies + `media` table are already provisioned in `supabase/storage-setup.sql` and `schema.sql`. Nothing else in the app (e.g. product image picker) reads from this library either. |
| Settings | ⚠️ | Persists to browser `localStorage` only — not shared across devices/admins, not DB-backed. Notification toggles (email/WhatsApp/low-stock alerts) don't trigger any actual notification logic anywhere. |
| Inventory tracking | ⚠️ | Stock is deducted correctly on order placement and logged to an `inventory` table via a DB trigger, but no admin page ever displays that log — only current stock counts are visible. |

## Data Layer (why all this matters)

- `isSupabaseConfigured()` is the single switch between "demo mode" (in-memory mock arrays) and "real mode" (Supabase). Currently `.env.local` has real Supabase credentials, so the live site is in real mode.
- Even in real mode, several admin features above (Collections, Orders, Media, Analytics, Dashboard recent-activity, Inquiry status PATCH) **ignore Supabase and use hardcoded/in-memory data regardless of configuration** — this isn't a demo-mode limitation, it's missing implementation.
- The 240-product catalog itself, even when seeded into real Supabase, is procedurally generated placeholder data (`lib/data/catalog.ts`) — not genuine client inventory.
- Schema also defines `countries`, `collection_products`, and `activity_logs` tables that no application code ever reads or writes — provisioned but unused.

## Top Priority Gaps (ranked)

1. **Order management is completely disconnected from real orders** — admin can't see or manage actual customer orders at all.
2. **Collections admin can't edit or delete**, and "create" doesn't persist.
3. **Media library is 100% fake** despite Storage being fully provisioned — no way to manage product images through the admin.
4. **Currency selector misquotes prices** (no FX conversion) — real risk if buyers rely on it.
5. **Language selector does nothing** but change a label — remove or implement.
6. **Contact form submissions vanish** — no persistence, no admin visibility.
7. **No payment integration** — checkout commits stock with no payment collected (fine if intentional as an RFQ flow, but should be labeled clearly as "request to order," not "checkout").
8. Inquiry status changes silently fail to save in standard server mode.
9. Dashboard/Analytics charts and "recent activity" panels never show real data.
10. No bulk operations in Products admin, despite being advertised.

## What's Actually Solid

Product catalog browsing, product detail pages, collections browsing, cart, buyer inquiry submission end-to-end, product CRUD in admin, dashboard stat tiles, dark mode, WhatsApp click-to-chat, and the underlying Supabase schema/RLS design are all genuinely working and reasonably well built. The gaps above are concentrated in admin back-office features (orders, collections, media, analytics) and a couple of cosmetic-only header controls (language, currency) — not in the core buyer-facing browsing experience.
