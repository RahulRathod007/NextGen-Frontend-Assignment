# Product Admin Dashboard (CartZone)

Next.js 14 · React 18 · TypeScript · Tailwind CSS · Axios · DummyJSON API

A polished admin dashboard to log in, browse, search, filter, paginate, and manage products.

## Features checklist

| Requirement | Status |
|---|---|
| Login (`emilys` / `emilyspass`) + error messages | Done |
| Auth-only product pages + logout | Done |
| Product list: image, title, category, price, rating, stock | Done |
| Desktop table / mobile cards | Done |
| Pagination with `limit`/`skip`, page numbers, Prev/Next, sizes 10/20/50, “Showing X–Y of Z” | Done |
| Debounced search via `/products/search?q=` | Done |
| Category filter + sort (price / rating / title) | Done |
| Product details with images, description, reviews + not-found | Done |
| Add / edit forms with validation + delete confirm | Done |
| Loading / empty / error + **Retry** | Done |
| Shared Axios instance (token + central errors) | Done |
| URL state for page, search, filter, sort | Done |
| No React Query / SWR / table libraries | Done |
| Race-safe search (`AbortController` + request id) | Done |
| Search vs category mutual exclusivity | Done |
| Local overlay for non-persistent CRUD | Done |
| Safe handling of bad URL params (`page=abc`, `page=999`) | Done |
| Double-submit guards on Login / Save / Delete | Done |

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Demo login:** `emilys` / `emilyspass`

```bash
npm run build
npm start
```

## Live demo

**https://product-admin-dashboard-three-phi.vercel.app**

## Deploy (Vercel)

Already deployed and linked to GitHub (`RahulRathod007/NextGen-Frontend-Assignment`).  
New pushes to `main` redeploy automatically.

To redeploy manually:

```bash
npx vercel --prod
```

No env vars required (DummyJSON is public).

## Project structure

```
app/
  login/page.tsx
  dashboard/
    layout.tsx          # auth shell + logout
    page.tsx            # product list
    products/new/
    products/[id]/
    products/[id]/edit/
components/             # small UI pieces
lib/
  axios.ts              # shared Axios + interceptors
  api.ts                # API functions only
  localStore.ts         # session CRUD overlay
  utils.ts
hooks/useAuth.ts
```

Product routes live under `/dashboard/...` so they stay behind the auth layout. Behaviour matches the brief (details, edit, not-found).

## Design decisions (short)

### Search vs category
DummyJSON cannot search and filter by category in one request. The UI treats them as **mutually exclusive**: starting a search clears category; picking a category clears search. A short hint explains why when search is active.

### Non-persistent CRUD
Create/update/delete hit DummyJSON, then we store an overlay in `localStorage` (`localStore.ts`) so the UI still shows adds/edits/deletes for the session.

### Race conditions
Each list fetch uses `AbortController` + a monotonic request id so slower older responses never overwrite newer ones (test with `&delay=2000` on the API URL if needed).

### Invalid URLs
`page=abc` falls back to `1`. Invalid `pageSize` falls back to `10`. `page=999` clamps to the last real page after totals load.

## Problem faced & fix

**`TypeError: cat.charAt is not a function`** — DummyJSON’s `/products/categories` now returns `{ slug, name, url }` objects. Fixed by switching to `/products/category-list` (string slugs). Login also changed to `accessToken` instead of `token`.

## Where AI helped

AI assisted scaffolding, DummyJSON response updates, AbortController wiring, and UI polish. All behaviour was checked against the assignment and DummyJSON live responses.

## Tech notes

- Axios only for HTTP
- Custom pagination / debounce / sort — no React Query, SWR, or table kits
- Tailwind design tokens: teal brand, amber accent, Syne + DM Sans
