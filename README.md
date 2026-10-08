# DECORA Civil & Interiors — Premium Corporate Website

A world-class, luxury dark-theme website for **DECORA Civil & Interiors** — civil construction, interior design, aluminum & glass solutions, renovations and modern building solutions.

**Stack:** React 19 · Vite · React Router 7 · Tailwind CSS · Framer Motion · GSAP · Swiper · React Icons · Node.js · Express 5 · MongoDB (Mongoose)

---

## ✨ Features

### Public website
- **Full-screen hero slider** (auto every 5s, Ken Burns zoom, glass content card, GSAP pointer parallax, staggered word reveal)
- **Animated stats** counters in glass cards (150+ projects, 100+ clients, 10+ years, 20+ cities)
- **About preview** with GSAP parallax imagery, **services grid** with GSAP scroll-triggered stagger
- **Featured projects mosaic** with hover zoom + project details popup
- **Why choose us**, **auto-sliding testimonials** (Swiper), **infinite client marquee** (2 rows, pause on hover)
- **Projects page** — animated category filters, grid, detail pages with gallery + lightbox, prev/next navigation, client testimonial, JSON-LD schema
- **Products & Services page** — service categories, product cards with **Inquiry** + **WhatsApp** buttons
- **Contact page** — lead form, company details, interactive Google Map
- **About page** — story timeline, mission/vision/values, team, animated achievements
- **Premium chrome:** luxury loading screen, scroll-progress bar, custom cursor, page transitions, floating WhatsApp + back-to-top, global project-inquiry popup, glassmorphism everywhere, fully responsive, accessible focus states, reduced-motion support

### Admin dashboard (JWT protected)
`/admin/login` → Dashboard, Projects CRUD (+ multi-image upload), Products CRUD, Clients CRUD, Testimonials CRUD, Contact Leads (search / status / delete)

### SEO
Dynamic meta tags + Open Graph + Twitter cards per page, canonical URLs, JSON-LD schema (site-wide + per project), `robots.txt`, `sitemap.xml`, semantic HTML

### Demo-safe data layer
Every public page tries the API first and **falls back to bundled content** when the backend/DB is offline — the site never breaks. Contact leads are queued in `localStorage` when offline and synced later.

---

## 📁 Structure

```
decora/
├── frontend/          # React + Vite (deploy → Vercel)
│   ├── public/        # favicon, robots.txt, sitemap.xml
│   └── src/
│       ├── components/{layout,home,ui,sections,projects}
│       ├── pages/     # Home, About, Projects, ProjectDetail, Products, Contact, Login, admin/*
│       ├── context/   # InquiryProvider (global inquiry popup)
│       ├── hooks/     # useCountUp
│       ├── lib/       # api.js (fetch layer + fallbacks + auth)
│       └── data/      # seed.js — all fallback content
├── backend/           # Express 5 + Mongoose REST API (deploy → Render/VPS)
│   └── src/{config,models,middleware,routes,utils}
├── vercel.json        # SPA rewrites + asset caching
└── render.yaml        # backend service definition
```

---

## 🚀 Getting started

### 1. Frontend
```bash
cd frontend
npm install
npm run dev        # http://localhost:5173  (proxies /api → :5000)
npm run build      # production bundle
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env      # then edit values (Windows: copy .env.example .env)
npm run seed              # creates admin user + sample content
npm run dev               # http://localhost:5000
```

**Default admin:** `admin@decora.com` / `Decora@2026`

> MongoDB required — local `mongod` or a free **MongoDB Atlas** cluster (`MONGO_URI` in `.env`).
> Without a database the API still boots (`/api/health` reports `db:false`) and the website runs on bundled content.

**No local MongoDB?** Use the in-memory demo database (downloads/uses `mongodb-memory-server`) and the API smoke test:

```bash
cd backend
npm run demo        # boots API on :5000 with seeded data — no mongod needed
npm run test:api    # 25-check E2E smoke test against a running API
```

Frontend has `npm run check:icons` — verifies every `react-icons` import exists (fast build sanity check).

---

## 🔌 API overview

Base URL `/api` · JSON shape `{ success, data, message? }` · Bearer JWT for admin routes.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | /auth/login | – | → `{ token, user }` |
| GET | /auth/me | ✓ | current user |
| GET/POST/PUT/DELETE | /projects · /products · /clients · /testimonials · /services | GET open | CRUD (+ `?featured=1`, `?category=`, `?search=`) |
| GET/POST/PATCH/DELETE | /messages | GET/PATCH/DELETE ✓ | contact leads |
| GET/PUT | /settings | GET open / PUT ✓ | site settings |
| GET | /stats | ✓ | dashboard counters |
| POST | /uploads | ✓ | multipart file → `{ url }` |
| GET | /health | – | liveness + db status |

Full details: [`backend/README.md`](backend/README.md)

---

## ☁️ Deployment

| Layer | Target | Config |
|---|---|---|
| Frontend | **Vercel** | `vercel.json` (SPA rewrites). Set env `VITE_API_URL=https://your-api-domain` |
| Backend | **Render / VPS** | `render.yaml` (or run `npm start`). Set `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGIN` |
| Database | **MongoDB Atlas** | free M0 cluster → `MONGO_URI` |

After deploying: `npm run seed` once (or hit it locally against Atlas) to create the admin user and starter content.

---

## 🎨 Design system

| Token | Value |
|---|---|
| Primary (bronze/copper) | `#B08D57` |
| Accent (soft gold) | `#C8A66B` |
| Charcoal | `#1A1A1A` |
| Backgrounds | `#0E0E0E` · `#111111` |
| Text | `#FFFFFF` · `#B8B8B8` |
| Glass | `rgba(255,255,255,0.08)` + `backdrop-blur(20px)` |
| Type | Cormorant Garamond (display) · Inter (body) |

Utility classes: `.glass` `.glass-strong` `.btn-primary/outline/ghost/dark` `.eyebrow` `.heading-xl/lg/md` `.lead` `.field` `.text-gradient` `.pattern-grid` `.container-luxe`

---

## ♿ Accessibility & performance
Lazy-loaded images with branded fallbacks, code-split routes (`React.lazy`), keyboard-navigable cards/modals, focus-visible rings, `prefers-reduced-motion` respected, semantic landmarks and labels throughout.
