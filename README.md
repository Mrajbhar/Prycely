# Prycely

> **Priced plainly, discounted honestly.**

Prycely is a full-stack e-commerce platform — an **ASP.NET Core 10** Web API
backend (MongoDB, JWT + Google auth, Razorpay payments, Ollama-powered search)
and a **React 19 + Vite** storefront with a warm, coral-accented design, INR
pricing, live deals, and wishlists.

**Repository:** `Mrajbhar/Prycely`

---

## Architecture

Prycely today is a **modular monolith**: a single deployable ASP.NET Core API
whose internals are cleanly separated into modules — controllers, services
(interfaces + implementations), validators, strongly-typed settings, middleware,
background jobs, and a data layer. This keeps development and deployment simple
while preserving clear seams between concerns.

The codebase is deliberately structured to be **extraction-ready**: because
each domain area is isolated behind service interfaces and its own settings,
individual modules can later be split into independent, separately deployable
microservices (for example **Catalog**, **Basket**, **Identity**, and
**Ordering**) behind an API gateway (e.g. YARP), with the frontend continuing to
talk to a single origin. That evolution is on the roadmap rather than in place
today — the current shipping architecture is the modular monolith described
above.

```
                    ┌─────────────────────────┐
   React 19  ─────► │   ECommerce.API (host)  │ ─────► MongoDB
   (Vite SPA)       │  ┌───────────────────┐  │
                    │  │ Auth / Identity   │  │ ─────► Google OAuth
                    │  │ Catalog / Search  │  │ ─────► Ollama (embeddings)
                    │  │ Payments          │  │ ─────► Razorpay
                    │  │ Files / Storage   │  │
                    │  └───────────────────┘  │
                    │  Cross-cutting: Serilog, │
                    │  rate limiting, CORS,    │
                    │  exception + security    │
                    │  headers middleware      │
                    └─────────────────────────┘
```

---

## Tech stack

### Backend (`ECommerce.API`)

| Technology | Purpose |
|---|---|
| ASP.NET Core 10 Web API | Main backend |
| C# | Primary language |
| MongoDB (MongoDB.Driver) | Database |
| FluentValidation | Request validation (auto-validation) |
| Serilog | Structured console + request logging |
| JWT Bearer | Authentication |
| Google OAuth | Social sign-in |
| ASP.NET Rate Limiting | Fixed-window, per-IP throttling |
| Razorpay | Payments (INR) |
| Ollama | AI embeddings / semantic product search |
| Swagger / OpenAPI | API docs (with JWT support) |

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI library |
| TypeScript | Type safety |
| Vite | Build tool / dev server |
| Tailwind CSS v4 | Styling |
| React Router | Routing |
| Zustand | Client/UI state (cart, wishlist, theme) |
| TanStack Query | Server state and caching |
| React Hook Form + Zod | Forms and validation |
| Framer Motion | Animations |
| Axios | HTTP client |

---

## Features

### Storefront (frontend)

- **Header & navigation** — Prycely logo, category nav (All, Books, Clothing,
  Electronics, Home & Kitchen, Sale), product search ("Search for products,
  brands and more"), and Sign in / Sign up
- **Announcement bar** — rotating promo line ("New arrivals every week")
- **Season-sale hero** — "Up to 40% off" with an "ENDS SUNDAY" badge, honest
  copy ("Across 130+ products. Priced plainly, discounted honestly."), a
  "Shop the sale" CTA, and featured products with prices and strikethrough
  originals
- **Category shortcuts** — quick circular links to Books, Clothing,
  Electronics, Home & Kitchen, and Deals
- **Trust marquee** — scrolling reassurances: Easy 7-day returns, 130+ products,
  New arrivals weekly, Secure checkout, Free shipping over ₹5,000
- **Deals of the Day** — a live countdown timer and a product row with
  "View all"
- **Product cards** — image, category tag, name, discount badge (e.g. 11% OFF),
  wishlist heart, current price, strikethrough original, discount percentage,
  and star rating with review count
- **Category promo tiles** — Electronics "Up to 40% off", Clothing "Min 30% off",
  Home & Books "From ₹299"
- **INR pricing** throughout (₹)
- **Wishlist** (heart toggle on products)
- Responsive layout with a warm coral/orange accent and dark hero

### Backend

Taken directly from the application's `Program.cs` startup pipeline:

- Consistent `ApiResponse<T>` response envelope, with a custom
  invalid-model-state formatter that shapes validation errors into the envelope
- JWT authentication and Google OAuth
- Per-IP rate limiting: a strict `auth` policy (10 req/min) and a `global`
  policy (120 req/min), returning a JSON 429 message
- Ollama embeddings with a hosted background job (`EmbeddingBackfillJob`) to
  backfill vectors for semantic search
- File / image storage service
- Razorpay payment settings (INR)
- MongoDB persistence with idempotent index initialization and, in Development,
  data seeding on startup
- Global exception-handling middleware and a security-headers middleware
- Serilog request logging
- CORS policy (`AllowFrontend`) reading allowed origins from configuration,
  with credentials allowed
- Swagger UI in Development
- `/health` endpoint and `PORT` binding for free-tier hosting (see Deployment)

---

## Categories

Books · Clothing · Electronics · Home & Kitchen · (Deals / Sale)

---

## Project structure

```
Prycely/
├── ECommerce.API/                # ASP.NET Core 10 backend (modular monolith)
│   ├── BackgroundJobs/           # EmbeddingBackfillJob
│   ├── Controllers/
│   ├── Data/                     # Mongo context, index init, seeder
│   ├── Extensions/               # DI registration (persistence, auth, swagger…)
│   ├── Middleware/               # Exception + security headers
│   ├── Models/Dtos/              # ApiResponse<T>, request/response DTOs
│   ├── Services/                 # Interfaces + implementations (domain modules)
│   ├── Settings/                 # Strongly-typed options (JWT, Razorpay…)
│   ├── Validators/               # FluentValidation validators
│   └── Program.cs
│
└── frontend/                     # React 19 + Vite
    └── src/
        ├── app/                  # App, router, providers
        ├── components/           # Layout, header, marquee, cold-start UI
        ├── features/             # home, catalog, product, deals, wishlist…
        ├── lib/                  # Shared axios client (JWT + envelope)
        ├── store/                # Zustand stores
        └── main.tsx
```

> The frontend tree is representative — adjust it to match your actual folders.

---

## Prerequisites

- .NET 10 SDK
- Node.js 20+
- MongoDB (local, Docker, or Atlas)
- Ollama (local or remote) for embeddings / semantic search
- Optional: Docker — `docker run -d -p 27017:27017 --name mongo mongo:7`

---

## Getting started

### Backend

```bash
cd ECommerce.API
dotnet restore
dotnet run
```

Swagger is served at `/swagger` in Development. Health check at `/health`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173`. In development, Vite proxies `/api` and
`/health` to the backend, so no environment variable is required locally.

---

## Configuration

The backend reads settings from `appsettings.json` (and environment variables
using the `Section__Key` convention on hosted platforms).

**Confirmed key from the codebase:**

| Key | Description |
|---|---|
| `Cors:AllowedOrigins` | Array of allowed frontend origins |

**Other settings — confirm the exact section names against your
`appsettings.json`.** The code registers these areas via settings classes and
extension methods:

- MongoDB connection (persistence)
- JWT (`AddJwtAuthentication`)
- Google auth (`AddGoogleAuth`)
- Ollama (`AddOllama`)
- Razorpay (`RazorpaySettings`)
- File storage (`FileStorageSettings`)

**Frontend:**

| Key | Description |
|---|---|
| `VITE_API_URL` | Backend base URL in production. Leave unset in dev to use the Vite proxy. |

---

## Deployment (Render free tier)

Free web services sleep after inactivity, so the first request after idle
triggers a cold start (~30–60s). Prycely handles this:

1. `Program.cs` binds to the host-injected `PORT`, trusts forwarded headers
   (`X-Forwarded-Proto`) so HTTPS redirection works behind the proxy, and
   exposes a dependency-free `/health` endpoint that responds as soon as the
   process is up.
2. The frontend pings `/health` on load and shows a wake-up screen with a live
   counter until the server responds; a reconnect banner covers the server
   sleeping mid-session.

Render environment variables:

- `ASPNETCORE_ENVIRONMENT=Production`
- `Cors__AllowedOrigins__0` = your deployed frontend URL (exact origin match;
  the CORS policy uses `AllowCredentials()`, so no trailing slash)
- MongoDB / JWT / Google / Razorpay / Ollama settings as env vars
- Do **not** set `ASPNETCORE_URLS` — the `PORT` binding handles it
- Frontend: `VITE_API_URL` = the backend `.onrender.com` URL

Optional: a free external cron (UptimeRobot, cron-job.org) hitting `/health`
every 10–14 minutes reduces cold starts during active hours, at the cost of
some monthly free hours.

---

## API response format

All endpoints return:

```json
{
  "success": true,
  "message": "Optional message",
  "data": {},
  "errors": { "field": ["error message"] }
}
```

The frontend axios client returns `data` on success and throws a typed
`ApiError` (with `message`, the per-field `errors` dictionary, and the HTTP
status) on failure.

---

## Roadmap

- [x] Backend API (auth, catalog, payments, semantic search)
- [x] Storefront: home, categories, deals of the day, product cards, wishlist
- [x] Cold-start handling for free-tier hosting
- [ ] Cart and checkout (Razorpay flow)
- [ ] Order history and account pages
- [ ] Product detail and reviews
- [ ] Extract modules into independent services (Catalog, Basket, Identity,
      Ordering) behind an API gateway

---

## Author

Built by **Mrajbhar** — `Mrajbhar/Prycely`

## License

MIT — see `LICENSE`.