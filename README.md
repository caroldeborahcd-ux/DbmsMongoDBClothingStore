# 👗 Threads & Co — Clothing Store Web Application

A full-stack clothing e-commerce application built with **React**, **Node.js/Express**, and **MongoDB**.

---

## 🗂 Project Structure

```
clothing-app/
├── backend/          # Node.js + Express API
│   ├── config/       # MongoDB connection
│   ├── models/       # Mongoose schemas (6 collections)
│   ├── routes/       # REST API routes
│   ├── middleware/   # JWT auth middleware
│   ├── server.js     # Express entry point
│   ├── seed.js       # Seed demo data
│   └── .env          # Environment variables
└── frontend/         # React application
    ├── public/
    └── src/
        ├── components/   # Navbar, Footer, ProductCard
        ├── context/      # Auth & Cart context
        ├── pages/        # Home, Products, Cart, Checkout, Admin
        ├── styles/       # Global CSS
        └── api.js        # Axios config
```

---

## ⚙️ Prerequisites

- **Node.js** v16+ → https://nodejs.org
- **MongoDB Community** (running locally) → https://www.mongodb.com/try/download/community
- **npm** (comes with Node.js)

---

## 🚀 Setup & Run

### 1. Start MongoDB
```bash
# macOS / Linux
mongod --dbpath /data/db

# Windows (run as Administrator)
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

### 2. Setup Backend
```bash
cd clothing-app/backend
npm install
npm run seed       # Seeds demo data (products, users, categories)
npm run dev        # Starts API on http://localhost:5000
```

### 3. Setup Frontend
```bash
cd clothing-app/frontend
npm install
npm start          # Starts React app on http://localhost:3000
```

---

## 🔑 Demo Credentials

| Role     | Email                    | Password      |
|----------|--------------------------|---------------|
| Admin    | admin@threads.com        | admin123      |
| Customer | customer@threads.com     | customer123   |

---

## 📡 API Endpoints

| Method | Endpoint                      | Description          | Auth     |
|--------|-------------------------------|----------------------|----------|
| POST   | /api/auth/register            | Register user        | Public   |
| POST   | /api/auth/login               | Login user           | Public   |
| GET    | /api/auth/profile             | Get profile          | User     |
| GET    | /api/products                 | List products        | Public   |
| GET    | /api/products/:id             | Product detail       | Public   |
| POST   | /api/products                 | Create product       | Admin    |
| PUT    | /api/products/:id             | Update product       | Admin    |
| GET    | /api/categories               | List categories      | Public   |
| GET    | /api/cart                     | Get user cart        | User     |
| POST   | /api/cart/add                 | Add to cart          | User     |
| DELETE | /api/cart/remove/:itemId      | Remove cart item     | User     |
| POST   | /api/orders                   | Place order          | User     |
| GET    | /api/orders/myorders          | My orders            | User     |
| GET    | /api/orders                   | All orders           | Admin    |
| PUT    | /api/orders/:id/status        | Update order status  | Admin    |
| GET    | /api/reviews/product/:id      | Product reviews      | Public   |
| POST   | /api/reviews                  | Post review          | User     |

---

## 🗃 MongoDB Collections (6 Tables)

| Collection   | Purpose                                    |
|--------------|--------------------------------------------|
| **users**    | Customer & admin accounts                  |
| **categories** | Product categories (Men's, Women's, etc.) |
| **products** | Product catalog with variants & images     |
| **orders**   | Purchase orders with shipping & payment    |
| **carts**    | Per-user shopping cart (persistent)        |
| **reviews**  | Product ratings and reviews                |

---

## ✨ Features

- 🛍 **Shop** — Browse by category, gender, price range, search
- 🛒 **Cart** — Add/remove items, update quantities
- 💳 **Checkout** — Address form + COD/UPI/Card/NetBanking
- 📦 **Orders** — Order history and tracking
- ⭐ **Reviews** — Product ratings and comments
- 👤 **Auth** — JWT-based register/login
- 🔐 **Admin Dashboard** — Manage orders & products
- 📱 **Responsive** — Works on mobile & desktop
