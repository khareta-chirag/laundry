# 🧺 Laundry Order Management System

A lightweight, AI-assisted order management system for a dry cleaning store. Built with zero external dependencies — pure Node.js on the backend and vanilla HTML/CSS/JS on the frontend.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+ (uses built-in `http`, `crypto`, `fs`, `path` — **no npm install needed**)

### Run the project

```bash
git clone <your-repo-url>
cd laundry-order-management

node server.js
```

Open your browser at: **http://localhost:3000**

To run in dev mode (auto-restart on file change, Node 18+):
```bash
node --watch server.js
```

---

## ✅ Features Implemented

### Core
| Feature | Status |
|---|---|
| Create order (name, phone, garments, qty) | ✅ |
| Auto-calculate total bill | ✅ |
| Unique Order ID (e.g. `ORD-A1B2C3D4`) | ✅ |
| Order statuses: RECEIVED → PROCESSING → READY → DELIVERED | ✅ |
| Update order status via API | ✅ |
| List all orders | ✅ |
| Filter by status, customer name/phone, garment type | ✅ |
| Dashboard: total orders, revenue, orders per status | ✅ |

### Bonus
| Feature | Status |
|---|---|
| Simple frontend (single-page HTML UI) | ✅ |
| Estimated delivery date (+3 days from order) | ✅ |
| Search by garment type | ✅ |
| Price list endpoint | ✅ |
| In-memory storage (clean, fast, no DB setup) | ✅ |
| Zero external dependencies | ✅ |

---

## 📁 Project Structure

```
laundry-order-management/
├── server.js          # All backend logic (router + handlers)
├── package.json
├── API_REFERENCE.md   # Curl/Postman-style API examples
└── public/
    └── index.html     # Full frontend (dashboard, create, orders, prices)
```

---

## 🤖 AI Usage Report

### Tools Used
- **Claude (Anthropic)** — primary tool for scaffolding and code generation

---

### Sample Prompts Used

**Prompt 1 — Initial scaffold:**
> "Build a Node.js HTTP server with no external dependencies that handles CRUD for laundry orders. Use in-memory Map storage. Routes: POST /orders, GET /orders (with filters), PATCH /orders/:id/status, GET /dashboard."

AI generated ~80% of the server.js structure correctly in one shot. It got routing, body parsing, and the Map-based store right.

**Prompt 2 — Frontend:**
> "Build a single HTML file frontend for this API. Include: dashboard with stat cards, create order form with dynamic garment rows and live bill preview, filterable orders table with inline status update dropdowns. No React, no build step."

AI scaffolded the full UI structure and CSS. The bill calculation logic and dynamic row management were nearly correct on first pass.

**Prompt 3 — Fixing CORS for same-origin:**
> "The API and frontend are served from the same Node server. I don't need CORS headers but I want them anyway for flexibility if I test with a separate frontend later."

---

### Where AI Helped Most
- **Boilerplate elimination**: The URL routing pattern (`req.url` + regex matching) was generated cleanly
- **CSS design system**: The badge styles, stat cards, and color variables were all AI-generated
- **Error handling patterns**: Try/catch wrapping of async handlers came from AI suggestion

---

### Where I Had to Fix / Improve AI Code

1. **Regex for order ID matching**: AI used `/^\/orders\/([^/]+)$/` which was too broad. I tightened it to `/^\/orders\/(ORD-[A-Z0-9]+)(\/status)?$/` to properly route both `GET /orders/:id` and `PATCH /orders/:id/status` without conflict.

2. **Bill preview visibility**: AI showed the bill preview div even when 0 garments existed. Added explicit `display:none` toggle based on garment row count.

3. **Frontend price sync**: AI generated the frontend assuming prices were hardcoded. I changed it to fetch `/prices` on init and populate the garment dropdowns dynamically — so pricing is always in sync with the server config.

4. **Status filter case sensitivity**: AI's filter used `===` directly against query param. I added `.toUpperCase()` so `?status=received` and `?status=RECEIVED` both work.

---

## ⚖️ Tradeoffs

### What I skipped
- **Database persistence** — In-memory storage means orders are lost on restart. For a production system, would use SQLite (zero-config) or MongoDB.
- **Authentication** — No login/auth. Any client can create or update orders.
- **Input validation** — Phone number and name validation is minimal (just presence check, not format).
- **Tests** — No unit or integration tests written.

### What I'd improve with more time
- Add SQLite persistence with a single `orders.db` file (still zero external infra)
- Add JWT-based authentication for the store owner
- Add SMS notification (via Twilio) when order status changes to READY
- Add print receipt view per order
- Deploy to Railway or Render with a single click

---

## 📮 API Quick Reference

See `API_REFERENCE.md` for full curl examples.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/orders` | Create new order |
| `GET` | `/orders` | List orders (supports `?status=`, `?search=`, `?garment=`) |
| `GET` | `/orders/:id` | Get single order |
| `PATCH` | `/orders/:id/status` | Update order status |
| `GET` | `/dashboard` | Summary stats |
| `GET` | `/prices` | Garment price list |
| `GET` | `/` | Frontend UI |

---

## 💰 Price Config

Prices are configured in `server.js` in the `PRICES` object and can be changed without touching any other code:

```js
const PRICES = {
  Shirt: 40, Pants: 50, Saree: 120,
  Jacket: 150, Kurta: 60, Suit: 200,
  Dress: 100, Bedsheet: 80, Towel: 30
};
```
