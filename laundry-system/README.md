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
