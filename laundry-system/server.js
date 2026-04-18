const http = require("http");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

// ─── In-memory store ────────────────────────────────────────────────────────
const orders = new Map();

// ─── Pricing config ─────────────────────────────────────────────────────────
const PRICES = {
  Shirt: 40,
  Pants: 50,
  Saree: 120,
  Jacket: 150,
  Kurta: 60,
  Suit: 200,
  Dress: 100,
  Bedsheet: 80,
  Towel: 30,
};

const STATUSES = ["RECEIVED", "PROCESSING", "READY", "DELIVERED"];

// ─── Helpers ────────────────────────────────────────────────────────────────
function json(res, data, status = 200) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
  });
}

function calcBill(garments) {
  return garments.reduce((total, g) => {
    const price = PRICES[g.name] || g.customPrice || 0;
    return total + price * (g.quantity || 1);
  }, 0);
}

function estimatedDelivery() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split("T")[0];
}

// ─── Route handlers ─────────────────────────────────────────────────────────

// POST /orders — create order
async function createOrder(req, res) {
  const body = await parseBody(req);
  const { customerName, phone, garments } = body;

  if (!customerName || !phone || !garments || !garments.length) {
    return json(res, { error: "customerName, phone, and garments are required" }, 400);
  }

  const id = "ORD-" + randomUUID().slice(0, 8).toUpperCase();
  const totalBill = calcBill(garments);

  const order = {
    id,
    customerName,
    phone,
    garments,
    totalBill,
    status: "RECEIVED",
    estimatedDelivery: estimatedDelivery(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  orders.set(id, order);
  json(res, { success: true, order }, 201);
}

// GET /orders — list all, with optional filters
function listOrders(req, res) {
  const url = new URL(req.url, "http://localhost");
  const status = url.searchParams.get("status");
  const search = url.searchParams.get("search")?.toLowerCase();
  const garment = url.searchParams.get("garment")?.toLowerCase();

  let result = Array.from(orders.values());

  if (status) {
    result = result.filter((o) => o.status === status.toUpperCase());
  }
  if (search) {
    result = result.filter(
      (o) =>
        o.customerName.toLowerCase().includes(search) ||
        o.phone.includes(search)
    );
  }
  if (garment) {
    result = result.filter((o) =>
      o.garments.some((g) => g.name.toLowerCase().includes(garment))
    );
  }

  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  json(res, { count: result.length, orders: result });
}

// GET /orders/:id — get single order
function getOrder(req, res, id) {
  const order = orders.get(id);
  if (!order) return json(res, { error: "Order not found" }, 404);
  json(res, order);
}

// PATCH /orders/:id/status — update status
async function updateStatus(req, res, id) {
  const order = orders.get(id);
  if (!order) return json(res, { error: "Order not found" }, 404);

  const body = await parseBody(req);
  const { status } = body;

  if (!STATUSES.includes(status)) {
    return json(res, { error: `Status must be one of: ${STATUSES.join(", ")}` }, 400);
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();
  json(res, { success: true, order });
}

// GET /dashboard — summary stats
function dashboard(req, res) {
  const all = Array.from(orders.values());
  const totalOrders = all.length;
  const totalRevenue = all.reduce((sum, o) => sum + o.totalBill, 0);
  const perStatus = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  all.forEach((o) => perStatus[o.status]++);

  json(res, {
    totalOrders,
    totalRevenue,
    ordersPerStatus: perStatus,
    recentOrders: all
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((o) => ({
        id: o.id,
        customerName: o.customerName,
        totalBill: o.totalBill,
        status: o.status,
      })),
  });
}

// GET /prices — return price list
function getPrices(req, res) {
  json(res, { prices: PRICES });
}

// ─── Serve frontend HTML ─────────────────────────────────────────────────────
function serveFrontend(res) {
  const filePath = path.join(__dirname, "public", "index.html");
  if (fs.existsSync(filePath)) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404);
    res.end("Frontend not found");
  }
}

// ─── Router ─────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const pathname = url.pathname;

  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  try {
    // Frontend
    if (pathname === "/" && req.method === "GET") return serveFrontend(res);

    // Dashboard
    if (pathname === "/dashboard" && req.method === "GET") return dashboard(req, res);

    // Prices
    if (pathname === "/prices" && req.method === "GET") return getPrices(req, res);

    // Create order
    if (pathname === "/orders" && req.method === "POST") return await createOrder(req, res);

    // List orders
    if (pathname === "/orders" && req.method === "GET") return listOrders(req, res);

    // Single order or status update
    const orderMatch = pathname.match(/^\/orders\/(ORD-[A-Z0-9]+)(\/status)?$/);
    if (orderMatch) {
      const id = orderMatch[1];
      if (orderMatch[2] && req.method === "PATCH") return await updateStatus(req, res, id);
      if (!orderMatch[2] && req.method === "GET") return getOrder(req, res, id);
    }

    json(res, { error: "Not found" }, 404);
  } catch (err) {
    json(res, { error: err.message }, 500);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🧺 Laundry Order System running at http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`🌐 Frontend:  http://localhost:${PORT}/\n`);
});
