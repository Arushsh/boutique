# 🛍️ Aura Boutique — Full-Stack Fashion E-Commerce

A premium boutique fashion e-commerce web application built with React, Node.js, Express, and MongoDB.

![Aura Boutique](https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200)

## ✨ Features

### Customer Facing
- 🏠 **Homepage** — Hero, featured collections, shop by category, trending products, promo banners
- 👗 **New Arrivals** — Paginated product grid with category filters and sidebar
- 🗂️ **Collections** — Curated collection showcase with image carousel
- 📖 **Lookbook** — Interactive masonry grid with hover-to-shop
- ❤️ **Wishlist** — Save items, move to cart, remove
- 🛒 **Cart & Checkout** — Full cart management with order placement
- 📬 **Contact** — Contact form with backend persistence
- 🔐 **Authentication** — Register, Login with JWT

### Admin Panel (`/admin`)
- 📊 Dashboard with live stats (revenue, orders, customers)
- 📦 Product CRUD (create, edit, delete)
- 🧾 Order management with status updates
- 👥 User management
- 📨 Message inbox (contact form submissions)
- ⚙️ Store settings (global sale banner)

## 🛠️ Tech Stack

| Layer     | Tech                            |
|-----------|---------------------------------|
| Frontend  | React 18, React Router, Vite    |
| Styling   | Vanilla CSS (glassmorphism)     |
| Backend   | Node.js, Express.js             |
| Database  | MongoDB Atlas + Mongoose        |
| Auth      | JWT (JSON Web Tokens)           |
| Icons     | Lucide React                    |
| Fonts     | Google Fonts (Playfair Display, Poppins) |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo
```bash
git clone https://github.com/Arushsh/boutique.git
cd boutique
```

### 2. Set up the Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 3. Set up the Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Seed sample products (optional)
```bash
cd backend
node seed.js
```

The app will be running at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

## 📁 Project Structure

```
boutique/
├── backend/
│   ├── middleware/       # auth, adminOnly
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   ├── server.js
│   └── .env.example
└── frontend/
    └── src/
        ├── api/          # Axios instance
        ├── components/   # Reusable components
        ├── context/      # AuthContext, CartContext
        └── pages/        # Route pages (incl. admin/)
```

## 🔑 Default Admin Access

After seeding, login with:
- **Email**: `admin@auraboutique.com`  
- **Password**: `admin123`

## 📄 License

MIT © Aura Boutique
