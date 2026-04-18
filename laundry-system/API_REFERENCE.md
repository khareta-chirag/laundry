# 🧺 Laundry Order Management System — API Reference
# Base URL: http://localhost:3000

## 1. Create Order
POST /orders
Content-Type: application/json

{
  "customerName": "Rahul Sharma",
  "phone": "9876543210",
  "garments": [
    { "name": "Shirt", "quantity": 3 },
    { "name": "Pants", "quantity": 2 },
    { "name": "Saree", "quantity": 1 }
  ]
}

# Response:
{
  "success": true,
  "order": {
    "id": "ORD-A1B2C3D4",
    "customerName": "Rahul Sharma",
    "phone": "9876543210",
    "garments": [...],
    "totalBill": 290,
    "status": "RECEIVED",
    "estimatedDelivery": "2026-04-21",
    "createdAt": "2026-04-18T10:00:00.000Z",
    "updatedAt": "2026-04-18T10:00:00.000Z"
  }
}

## 2. Get All Orders
GET /orders

# With filters:
GET /orders?status=RECEIVED
GET /orders?search=rahul
GET /orders?search=9876543210
GET /orders?garment=shirt

## 3. Get Single Order
GET /orders/ORD-A1B2C3D4

## 4. Update Order Status
PATCH /orders/ORD-A1B2C3D4/status
Content-Type: application/json

{
  "status": "PROCESSING"
}

# Valid statuses: RECEIVED | PROCESSING | READY | DELIVERED

## 5. Dashboard
GET /dashboard

# Response:
{
  "totalOrders": 15,
  "totalRevenue": 4350,
  "ordersPerStatus": {
    "RECEIVED": 3,
    "PROCESSING": 5,
    "READY": 4,
    "DELIVERED": 3
  },
  "recentOrders": [...]
}

## 6. Price List
GET /prices

# Response:
{
  "prices": {
    "Shirt": 40,
    "Pants": 50,
    "Saree": 120,
    "Jacket": 150,
    "Kurta": 60,
    "Suit": 200,
    "Dress": 100,
    "Bedsheet": 80,
    "Towel": 30
  }
}
