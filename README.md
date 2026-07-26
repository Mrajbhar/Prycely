# Prycely — Full-Stack E-Commerce Platform

**Priced plainly — no hidden fees.**

Prycely is a production-style e-commerce application: a dense, image-led retail storefront backed by a layered ASP.NET Core Web API, MongoDB, and local AI-powered semantic search. It covers the full commerce lifecycle — browsing, cart, checkout, payments, orders, reviews — plus an admin dashboard for running the store and a customer account hub.

> Currency is Indian Rupee (₹, `en-IN`). Built and tested for the Indian market.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment configuration](#environment-configuration)
- [Running locally](#running-locally)
- [Seeding & bulk data](#seeding--bulk-data)
- [AI semantic search (Ollama)](#ai-semantic-search-ollama)
- [Payments (Razorpay)](#payments-razorpay)
- [Authentication](#authentication)
- [API overview](#api-overview)
- [Deployment](#deployment)
- [Admin access](#admin-access)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

### Storefront
- **Full-width, dense retail layout** — edge-to-edge product grids that scale from 2 columns on mobile to 8 on ultra-wide screens.
- **Product catalogue** — categories, filters (price, stock, on-sale), and multiple sort options.
- **Product detail pages** — image gallery, price breakdown with genuine savings, stock urgency, and ratings.
- **Cart & Bag** — live totals, free-shipping progress, and a savings summary.
- **Checkout** — order placement with a shipping address and Razorpay payment.
- **Wishlist** — optimistic heart toggles that update instantly.
- **Semantic search** — describe what you want in plain words; results are ranked by AI similarity with a "% match" score.

### Customer account
- **Account hub** — overview, orders, saved addresses, wishlist, and profile in one place.
- **Saved addresses** — an address book with a default address, reused at checkout.
- **Order history** — full order detail with per-item review entry once delivered.

### Reviews
- Any signed-in customer can review a product once.
- Reviews from actual buyers carry a **Verified purchase** badge (based on a paid order containing the product).
- Live rating distribution with animated bars.

### Admin
- **Dashboard** — revenue trend chart, orders-by-status bars, top products, low-stock alerts, and recent orders.
- **Product management** — full CRUD with image upload, attributes, and stock status.
- **Order management** — status tabs and an inline state machine (Pending → Confirmed → Shipped → Delivered).
- **Category management.**

### Platform
- JWT authentication with refresh-token rotation.
- Google OAuth sign-in.
- Rate limiting, security headers, and structured logging.
- A **wake-up screen** for free-tier hosting cold starts.

---

## Tech stack

### Frontend
| Concern | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 |
| State (global) | Redux Toolkit |
| State (server) | TanStack Query (React Query) |
| Routing | React Router |
| Forms | React Hook Form + Zod |
| Animation | Framer Motion |
| Charts | Custom SVG (no chart library on the dashboard) |
| HTTP | Axios |

### Backend
| Concern | Choice |
|---|---|
| Framework | ASP.NET Core 10 Web API (C#) |
| Database | MongoDB (Atlas) via MongoDB.Driver |
| Validation | FluentValidation |
| Logging | Serilog |
| Auth | JWT + refresh tokens, Google OAuth |
| AI | Ollama (local) — `nomic-embed-text` embeddings |
| Payments | Razorpay |
| Docs | Swagger / OpenAPI |

---

## Architecture

### Backend — single-project layered Web API

```
Controllers/        HTTP endpoints
Models/
  Entities/         MongoDB documents
  Dtos/             Request/response shapes
Data/               Mongo context, index init, seeder
Services/
  Interfaces/       Service contracts
  Implementations/  Business logic
Validators/         FluentValidation rules
Middleware/         Exception handling, security headers
Exceptions/         Custom exception types
Settings/           Strongly-typed config sections
Extensions/         DI registration helpers
BackgroundJobs/     Embedding backfill worker
```

**Key conventions**
- Custom exceptions bubble through `ExceptionMiddleware` and are wrapped in a consistent `ApiResponse<T>` envelope: `{ success, message, data, errors }`.
- Manual DTO mapping (no AutoMapper) via `MapToDto` methods.
- Primary constructors for dependency injection in controllers and services.
- MongoDB indexes created at startup; refresh tokens expire via a TTL index.

**Address model** — two distinct types, intentionally separate:
- `Address` (on `Order`) — the **frozen shipping snapshot**; includes `Country`. Never changes after an order is placed.
- `SavedAddress` (on `User`) — an **editable address-book entry**; has `Id`, `Label`, `IsDefault`. Copied into an `Address` snapshot at checkout.

### Frontend — feature-first structure

```
src/
  app/              router, redux store, query client
  components/
    layout/         Header, Footer, AccountLayout, RootLayout
    admin/          AdminLayout
    products/       ProductCard, ProductGrid, filters, glyphs
    cart/           CartDrawer, cart lines
    reviews/        ReviewList, ReviewForm
    ui/             Button, Input, Skeleton, Toast, Logo, etc.
  features/         API clients + React Query hooks per domain
    auth/  cart/  orders/  products/  categories/
    wishlist/  reviews/  search/  dashboard/  addresses/
  pages/            route components
    account/        account hub pages
    admin/          admin pages
  lib/              axios instance, formatters, token store
  types/            shared TypeScript types
```

---

## Project structure (high level)

```
/                       repo root
├─ ECommerce.API/       ASP.NET Core backend
│  └─ ECommerce.API/    project folder
└─ frontend/            React + Vite frontend
```

> Adjust paths to match your actual layout. In development the backend runs at
> `https://localhost:7055` (and `http://localhost:5136`); the frontend at `http://localhost:5173`.

---

## Getting started

### Prerequisites
- **.NET 10 SDK**
- **Node.js 20+** and npm
- **MongoDB** — a free MongoDB Atlas cluster is easiest
- **Ollama** (optional, for semantic search) — https://ollama.com
- **Razorpay** test account (optional, for payments)

### Clone

```bash
git clone <your-repo-url>
cd <repo>
```

---

## Environment configuration

### Backend — `appsettings.json` / user secrets / environment variables

Configure these (use **user secrets** or environment variables for anything sensitive — never commit real secrets):

```jsonc
{
  "MongoDb": {
    "ConnectionString": "mongodb+srv://<user>:<pass>@<cluster>/",
    "DatabaseName": "prycely"
  },
  "Jwt": {
    "Secret": "<a-long-random-secret>",
    "Issuer": "Prycely",
    "Audience": "PrycelyClient",
    "AccessTokenMinutes": 15,
    "RefreshTokenDays": 7
  },
  "GoogleAuth": {
    "ClientId": "<google-client-id>",
    "ClientSecret": "<google-client-secret>"
  },
  "Ollama": {
    "BaseUrl": "http://localhost:11434",
    "EmbeddingModel": "nomic-embed-text"
  },
  "Razorpay": {
    "KeyId": "<razorpay-key-id>",
    "KeySecret": "<razorpay-key-secret>"
  },
  "Cors": {
    "AllowedOrigins": [ "http://localhost:5173" ]
  }
}
```

### Frontend — `.env`

```env
VITE_API_URL=https://localhost:7055/api
```

> `VITE_API_URL` ends in `/api`. The health-check ping strips this to reach the root `/health`.

---

## Running locally

### 1. Start the backend

```bash
cd ECommerce.API/ECommerce.API
dotnet restore
dotnet run
```

- API: `https://localhost:7055`
- Swagger UI (development only): `https://localhost:7055/swagger`

On first run in development, the database is seeded (categories, an admin user, sample data) and indexes are created.

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

- App: `http://localhost:5173`

---

## Seeding & bulk data

- In **development**, `MongoDbSeeder` runs at startup and creates the base data.
- To bulk-import products, use `POST /api/products/bulk` with a JSON array of product objects (admin token required). It reports created / skipped / failed counts and skips duplicates by slug/SKU.
- After a bulk import, trigger embeddings so semantic search picks up the new products:

```
POST /api/products/embeddings/backfill   (admin token)
```

---

## AI semantic search (Ollama)

Semantic search lets users describe intent ("something to keep coffee warm", "a gift for someone who codes") instead of matching keywords.

**How it works**
1. Each product gets an embedding vector from Ollama's `nomic-embed-text` model.
2. A background job (`EmbeddingBackfillJob`) generates embeddings hourly for any product missing one.
3. A search query is embedded on the fly and compared to product embeddings by cosine similarity.
4. The `/search` page shows results ranked by a **% match** score.

**Setup**

```bash
# install Ollama, then:
ollama pull nomic-embed-text
ollama serve
```

**Notes**
- Ollama runs **locally** at `http://localhost:11434`. Semantic search only works where Ollama is reachable by the API.
- If Ollama is offline, search degrades gracefully ("Search is unavailable") — the rest of the app is unaffected.
- The keyword filter on the Products page does **not** use Ollama; only `/search` does.

---

## Payments (Razorpay)

- Checkout creates a Razorpay order; the client completes payment via the Razorpay checkout script.
- The HMAC signature is **verified server-side** before an order is marked paid.

**Test payments**
- Test UPI: `success@razorpay` — reliably succeeds.
- If a test card is rejected with "international cards not supported", enable international cards in the Razorpay dashboard or use UPI. This is an account setting, not a code issue.

---

## Authentication

- **Register / login** issue a short-lived **access token** and a longer-lived **refresh token**.
- Refresh tokens **rotate** on use; the old token is invalidated. Expired tokens are cleaned up by a TTL index.
- **Google OAuth** — the backend completes the OAuth flow and hands the SPA its own JWT via the callback.
- Passwords are hashed with PBKDF2.
- The Axios layer transparently refreshes an expired access token once and retries the original request.

---

## API overview

All responses use the envelope:

```json
{ "success": true, "message": null, "data": {}, "errors": null }
```

Representative endpoints (all under `/api`):

| Area | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`, `GET /auth/google` |
| Products | `GET /products`, `GET /products/{id}`, `GET /products/slug/{slug}`, `GET /products/{id}/similar`, `POST /products`, `POST /products/bulk`, `PUT /products/{id}`, `DELETE /products/{id}` |
| Categories | `GET /categories`, `POST /categories`, `PUT /categories/{id}`, `DELETE /categories/{id}` |
| Cart | `GET /cart`, `POST /cart`, `PUT /cart/{productId}`, `DELETE /cart/{productId}` |
| Orders | `GET /orders`, `GET /orders/{id}`, `POST /orders`, `POST /orders/{id}/cancel`, admin status updates |
| Reviews | `GET /reviews/product/{id}`, `GET /reviews/product/{id}/summary`, `GET /reviews/product/{id}/can-review`, `POST /reviews`, `PUT /reviews/{id}`, `DELETE /reviews/{id}` |
| Wishlist | `GET /wishlist`, `GET /wishlist/ids`, `POST /wishlist/{productId}`, `DELETE /wishlist/{productId}` |
| Addresses | `GET /addresses`, `POST /addresses`, `PUT /addresses/{id}`, `DELETE /addresses/{id}`, `PUT /addresses/{id}/default` |
| Search | `GET /search?q=...` (semantic) |
| Dashboard | `GET /dashboard/stats`, `/revenue`, `/order-status`, `/top-products`, `/low-stock` |
| Health | `GET /health` (root, not under `/api`) |

Full, always-current documentation is in **Swagger** at `/swagger` in development.

---

## Deployment

### Backend on Render (free tier)

The project is set up to run behind Render's HTTPS proxy on plain HTTP:

- Binds to `http://0.0.0.0:$PORT` using the `PORT` environment variable.
- Uses `ForwardedHeaders` for the proxy.
- **HTTPS redirection is disabled in production** (the proxy terminates TLS; forcing a redirect would loop).
- The health check `/health` is CORS-enabled and **not** rate-limited, so cold-start pings aren't blocked or throttled.

**Render environment variables** (examples — set your own values):

```
PORT                              (provided by Render)
MongoDb__ConnectionString         mongodb+srv://...
MongoDb__DatabaseName             prycely
Jwt__Secret                       <secret>
Razorpay__KeyId                   <key>
Razorpay__KeySecret               <secret>
Cors__AllowedOrigins__0           https://<your-frontend-domain>
```

> Config keys use double-underscore (`__`) for nesting, and array indices like `Cors__AllowedOrigins__0`.

### Cold starts & the wake-up screen

Render's free tier spins the service down after ~15 minutes of inactivity; the first request afterward takes 30–60 seconds to wake ("cold start").

To handle this gracefully:
- A **`WakeUpGate`** wraps the app. On load it pings `/health`. If the server doesn't respond within a short grace period, it shows a branded "Waking up the server…" screen with a live counter, retrying until the API responds — then it disappears.
- `index.html` fires an **early `fetch('/health')`** before React mounts, so the server starts warming while the JS bundle downloads.
- Optionally, an external cron pinger (e.g. UptimeRobot) hits `/health` every ~14 minutes to keep the service warm during demo hours.

The wake-up screen almost never appears locally (localhost responds instantly), so it doesn't interfere with development.

### Frontend

Build a static bundle and host it anywhere (Vercel, Netlify, Render Static, etc.):

```bash
cd frontend
npm run build      # outputs to dist/
```

Set `VITE_API_URL` to your deployed API URL (ending in `/api`) at build time, and add the deployed frontend origin to the backend's `Cors:AllowedOrigins`.

---

## Admin access

A default admin is seeded in development:

```
Email:    admin@ecommerce.local
Password: Admin@123
```

Sign in, then open **Admin** from the account menu to reach the dashboard at `/admin`.

> Change or remove these credentials before any public deployment.

---

## Security checklist (before going public)

- [ ] Rotate all secrets out of `appsettings.json` (use environment variables / user secrets).
- [ ] Restrict the MongoDB Atlas network access list (avoid `0.0.0.0/0`).
- [ ] Rotate the Razorpay key secret if it was ever committed.
- [ ] Change the seeded admin credentials.
- [ ] Set `Cors:AllowedOrigins` to only your real frontend domain(s).

---

## Roadmap

- Password reset flow.
- Order-confirmation and shipping emails.
- Razorpay webhook for payment reconciliation (tab-closed-mid-payment edge cases).
- Automated tests (unit + integration).
- Dockerization.

---

## License

This project is provided as-is for portfolio and educational purposes. Add a license of your choice (e.g. MIT) before distributing.

---

*Built with React, ASP.NET Core, MongoDB, and Ollama.*# Prycely — Full-Stack E-Commerce Platform

**Priced plainly — no hidden fees.**

Prycely is a production-style e-commerce application: a dense, image-led retail storefront backed by a layered ASP.NET Core Web API, MongoDB, and local AI-powered semantic search. It covers the full commerce lifecycle — browsing, cart, checkout, payments, orders, reviews — plus an admin dashboard for running the store and a customer account hub.

> Currency is Indian Rupee (₹, `en-IN`). Built and tested for the Indian market.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment configuration](#environment-configuration)
- [Running locally](#running-locally)
- [Seeding & bulk data](#seeding--bulk-data)
- [AI semantic search (Ollama)](#ai-semantic-search-ollama)
- [Payments (Razorpay)](#payments-razorpay)
- [Authentication](#authentication)
- [API overview](#api-overview)
- [Deployment](#deployment)
- [Admin access](#admin-access)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

### Storefront
- **Full-width, dense retail layout** — edge-to-edge product grids that scale from 2 columns on mobile to 8 on ultra-wide screens.
- **Product catalogue** — categories, filters (price, stock, on-sale), and multiple sort options.
- **Product detail pages** — image gallery, price breakdown with genuine savings, stock urgency, and ratings.
- **Cart & Bag** — live totals, free-shipping progress, and a savings summary.
- **Checkout** — order placement with a shipping address and Razorpay payment.
- **Wishlist** — optimistic heart toggles that update instantly.
- **Semantic search** — describe what you want in plain words; results are ranked by AI similarity with a "% match" score.

### Customer account
- **Account hub** — overview, orders, saved addresses, wishlist, and profile in one place.
- **Saved addresses** — an address book with a default address, reused at checkout.
- **Order history** — full order detail with per-item review entry once delivered.

### Reviews
- Any signed-in customer can review a product once.
- Reviews from actual buyers carry a **Verified purchase** badge (based on a paid order containing the product).
- Live rating distribution with animated bars.

### Admin
- **Dashboard** — revenue trend chart, orders-by-status bars, top products, low-stock alerts, and recent orders.
- **Product management** — full CRUD with image upload, attributes, and stock status.
- **Order management** — status tabs and an inline state machine (Pending → Confirmed → Shipped → Delivered).
- **Category management.**

### Platform
- JWT authentication with refresh-token rotation.
- Google OAuth sign-in.
- Rate limiting, security headers, and structured logging.
- A **wake-up screen** for free-tier hosting cold starts.

---

## Tech stack

### Frontend
| Concern | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 |
| State (global) | Redux Toolkit |
| State (server) | TanStack Query (React Query) |
| Routing | React Router |
| Forms | React Hook Form + Zod |
| Animation | Framer Motion |
| Charts | Custom SVG (no chart library on the dashboard) |
| HTTP | Axios |

### Backend
| Concern | Choice |
|---|---|
| Framework | ASP.NET Core 10 Web API (C#) |
| Database | MongoDB (Atlas) via MongoDB.Driver |
| Validation | FluentValidation |
| Logging | Serilog |
| Auth | JWT + refresh tokens, Google OAuth |
| AI | Ollama (local) — `nomic-embed-text` embeddings |
| Payments | Razorpay |
| Docs | Swagger / OpenAPI |

---

## Architecture

### Backend — single-project layered Web API

```
Controllers/        HTTP endpoints
Models/
  Entities/         MongoDB documents
  Dtos/             Request/response shapes
Data/               Mongo context, index init, seeder
Services/
  Interfaces/       Service contracts
  Implementations/  Business logic
Validators/         FluentValidation rules
Middleware/         Exception handling, security headers
Exceptions/         Custom exception types
Settings/           Strongly-typed config sections
Extensions/         DI registration helpers
BackgroundJobs/     Embedding backfill worker
```

**Key conventions**
- Custom exceptions bubble through `ExceptionMiddleware` and are wrapped in a consistent `ApiResponse<T>` envelope: `{ success, message, data, errors }`.
- Manual DTO mapping (no AutoMapper) via `MapToDto` methods.
- Primary constructors for dependency injection in controllers and services.
- MongoDB indexes created at startup; refresh tokens expire via a TTL index.

**Address model** — two distinct types, intentionally separate:
- `Address` (on `Order`) — the **frozen shipping snapshot**; includes `Country`. Never changes after an order is placed.
- `SavedAddress` (on `User`) — an **editable address-book entry**; has `Id`, `Label`, `IsDefault`. Copied into an `Address` snapshot at checkout.

### Frontend — feature-first structure

```
src/
  app/              router, redux store, query client
  components/
    layout/         Header, Footer, AccountLayout, RootLayout
    admin/          AdminLayout
    products/       ProductCard, ProductGrid, filters, glyphs
    cart/           CartDrawer, cart lines
    reviews/        ReviewList, ReviewForm
    ui/             Button, Input, Skeleton, Toast, Logo, etc.
  features/         API clients + React Query hooks per domain
    auth/  cart/  orders/  products/  categories/
    wishlist/  reviews/  search/  dashboard/  addresses/
  pages/            route components
    account/        account hub pages
    admin/          admin pages
  lib/              axios instance, formatters, token store
  types/            shared TypeScript types
```

---

## Project structure (high level)

```
/                       repo root
├─ ECommerce.API/       ASP.NET Core backend
│  └─ ECommerce.API/    project folder
└─ frontend/            React + Vite frontend
```

> Adjust paths to match your actual layout. In development the backend runs at
> `https://localhost:7055` (and `http://localhost:5136`); the frontend at `http://localhost:5173`.

---

## Getting started

### Prerequisites
- **.NET 10 SDK**
- **Node.js 20+** and npm
- **MongoDB** — a free MongoDB Atlas cluster is easiest
- **Ollama** (optional, for semantic search) — https://ollama.com
- **Razorpay** test account (optional, for payments)

### Clone

```bash
git clone <your-repo-url>
cd <repo>
```

---

## Environment configuration

### Backend — `appsettings.json` / user secrets / environment variables

Configure these (use **user secrets** or environment variables for anything sensitive — never commit real secrets):

```jsonc
{
  "MongoDb": {
    "ConnectionString": "mongodb+srv://<user>:<pass>@<cluster>/",
    "DatabaseName": "prycely"
  },
  "Jwt": {
    "Secret": "<a-long-random-secret>",
    "Issuer": "Prycely",
    "Audience": "PrycelyClient",
    "AccessTokenMinutes": 15,
    "RefreshTokenDays": 7
  },
  "GoogleAuth": {
    "ClientId": "<google-client-id>",
    "ClientSecret": "<google-client-secret>"
  },
  "Ollama": {
    "BaseUrl": "http://localhost:11434",
    "EmbeddingModel": "nomic-embed-text"
  },
  "Razorpay": {
    "KeyId": "<razorpay-key-id>",
    "KeySecret": "<razorpay-key-secret>"
  },
  "Cors": {
    "AllowedOrigins": [ "http://localhost:5173" ]
  }
}
```

### Frontend — `.env`

```env
VITE_API_URL=https://localhost:7055/api
```

> `VITE_API_URL` ends in `/api`. The health-check ping strips this to reach the root `/health`.

---

## Running locally

### 1. Start the backend

```bash
cd ECommerce.API/ECommerce.API
dotnet restore
dotnet run
```

- API: `https://localhost:7055`
- Swagger UI (development only): `https://localhost:7055/swagger`

On first run in development, the database is seeded (categories, an admin user, sample data) and indexes are created.

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

- App: `http://localhost:5173`

---

## Seeding & bulk data

- In **development**, `MongoDbSeeder` runs at startup and creates the base data.
- To bulk-import products, use `POST /api/products/bulk` with a JSON array of product objects (admin token required). It reports created / skipped / failed counts and skips duplicates by slug/SKU.
- After a bulk import, trigger embeddings so semantic search picks up the new products:

```
POST /api/products/embeddings/backfill   (admin token)
```

---

## AI semantic search (Ollama)

Semantic search lets users describe intent ("something to keep coffee warm", "a gift for someone who codes") instead of matching keywords.

**How it works**
1. Each product gets an embedding vector from Ollama's `nomic-embed-text` model.
2. A background job (`EmbeddingBackfillJob`) generates embeddings hourly for any product missing one.
3. A search query is embedded on the fly and compared to product embeddings by cosine similarity.
4. The `/search` page shows results ranked by a **% match** score.

**Setup**

```bash
# install Ollama, then:
ollama pull nomic-embed-text
ollama serve
```

**Notes**
- Ollama runs **locally** at `http://localhost:11434`. Semantic search only works where Ollama is reachable by the API.
- If Ollama is offline, search degrades gracefully ("Search is unavailable") — the rest of the app is unaffected.
- The keyword filter on the Products page does **not** use Ollama; only `/search` does.

---

## Payments (Razorpay)

- Checkout creates a Razorpay order; the client completes payment via the Razorpay checkout script.
- The HMAC signature is **verified server-side** before an order is marked paid.

**Test payments**
- Test UPI: `success@razorpay` — reliably succeeds.
- If a test card is rejected with "international cards not supported", enable international cards in the Razorpay dashboard or use UPI. This is an account setting, not a code issue.

---

## Authentication

- **Register / login** issue a short-lived **access token** and a longer-lived **refresh token**.
- Refresh tokens **rotate** on use; the old token is invalidated. Expired tokens are cleaned up by a TTL index.
- **Google OAuth** — the backend completes the OAuth flow and hands the SPA its own JWT via the callback.
- Passwords are hashed with PBKDF2.
- The Axios layer transparently refreshes an expired access token once and retries the original request.

---

## API overview

All responses use the envelope:

```json
{ "success": true, "message": null, "data": {}, "errors": null }
```

Representative endpoints (all under `/api`):

| Area | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`, `GET /auth/google` |
| Products | `GET /products`, `GET /products/{id}`, `GET /products/slug/{slug}`, `GET /products/{id}/similar`, `POST /products`, `POST /products/bulk`, `PUT /products/{id}`, `DELETE /products/{id}` |
| Categories | `GET /categories`, `POST /categories`, `PUT /categories/{id}`, `DELETE /categories/{id}` |
| Cart | `GET /cart`, `POST /cart`, `PUT /cart/{productId}`, `DELETE /cart/{productId}` |
| Orders | `GET /orders`, `GET /orders/{id}`, `POST /orders`, `POST /orders/{id}/cancel`, admin status updates |
| Reviews | `GET /reviews/product/{id}`, `GET /reviews/product/{id}/summary`, `GET /reviews/product/{id}/can-review`, `POST /reviews`, `PUT /reviews/{id}`, `DELETE /reviews/{id}` |
| Wishlist | `GET /wishlist`, `GET /wishlist/ids`, `POST /wishlist/{productId}`, `DELETE /wishlist/{productId}` |
| Addresses | `GET /addresses`, `POST /addresses`, `PUT /addresses/{id}`, `DELETE /addresses/{id}`, `PUT /addresses/{id}/default` |
| Search | `GET /search?q=...` (semantic) |
| Dashboard | `GET /dashboard/stats`, `/revenue`, `/order-status`, `/top-products`, `/low-stock` |
| Health | `GET /health` (root, not under `/api`) |

Full, always-current documentation is in **Swagger** at `/swagger` in development.

---

## Deployment

### Backend on Render (free tier)

The project is set up to run behind Render's HTTPS proxy on plain HTTP:

- Binds to `http://0.0.0.0:$PORT` using the `PORT` environment variable.
- Uses `ForwardedHeaders` for the proxy.
- **HTTPS redirection is disabled in production** (the proxy terminates TLS; forcing a redirect would loop).
- The health check `/health` is CORS-enabled and **not** rate-limited, so cold-start pings aren't blocked or throttled.

**Render environment variables** (examples — set your own values):

```
PORT                              (provided by Render)
MongoDb__ConnectionString         mongodb+srv://...
MongoDb__DatabaseName             prycely
Jwt__Secret                       <secret>
Razorpay__KeyId                   <key>
Razorpay__KeySecret               <secret>
Cors__AllowedOrigins__0           https://<your-frontend-domain>
```

> Config keys use double-underscore (`__`) for nesting, and array indices like `Cors__AllowedOrigins__0`.

### Cold starts & the wake-up screen

Render's free tier spins the service down after ~15 minutes of inactivity; the first request afterward takes 30–60 seconds to wake ("cold start").

To handle this gracefully:
- A **`WakeUpGate`** wraps the app. On load it pings `/health`. If the server doesn't respond within a short grace period, it shows a branded "Waking up the server…" screen with a live counter, retrying until the API responds — then it disappears.
- `index.html` fires an **early `fetch('/health')`** before React mounts, so the server starts warming while the JS bundle downloads.
- Optionally, an external cron pinger (e.g. UptimeRobot) hits `/health` every ~14 minutes to keep the service warm during demo hours.

The wake-up screen almost never appears locally (localhost responds instantly), so it doesn't interfere with development.

### Frontend

Build a static bundle and host it anywhere (Vercel, Netlify, Render Static, etc.):

```bash
cd frontend
npm run build      # outputs to dist/
```

Set `VITE_API_URL` to your deployed API URL (ending in `/api`) at build time, and add the deployed frontend origin to the backend's `Cors:AllowedOrigins`.

---

## Admin access

A default admin is seeded in development:

```
Email:    admin@ecommerce.local
Password: Admin@123
```

Sign in, then open **Admin** from the account menu to reach the dashboard at `/admin`.

> Change or remove these credentials before any public deployment.

---

## Security checklist (before going public)

- [ ] Rotate all secrets out of `appsettings.json` (use environment variables / user secrets).
- [ ] Restrict the MongoDB Atlas network access list (avoid `0.0.0.0/0`).
- [ ] Rotate the Razorpay key secret if it was ever committed.
- [ ] Change the seeded admin credentials.
- [ ] Set `Cors:AllowedOrigins` to only your real frontend domain(s).

---

## Roadmap

- Password reset flow.
- Order-confirmation and shipping emails.
- Razorpay webhook for payment reconciliation (tab-closed-mid-payment edge cases).
- Automated tests (unit + integration).
- Dockerization.

---

## License

This project is provided as-is for portfolio and educational purposes. Add a license of your choice (e.g. MIT) before distributing.

---

*Built with React, ASP.NET Core, MongoDB, and Ollama.*