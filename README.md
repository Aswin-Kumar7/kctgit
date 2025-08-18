# Food Ordering System

A full-stack food ordering application built with TypeScript, Node.js (Express) backend, and React frontend.

## Features

- 🍽️ Browse menu items with categories
- 🛒 Add items to cart with quantity management
- 💳 Place orders with total calculation
- 📋 View order details and history
- 🔐 Authentication with JWT and email OTP
- 🎨 Modern UI with TailwindCSS
- 🔒 Type-safe development with TypeScript

## Project Structure

```
food-ordering-system/
├── backend/          # Node.js + Express + TypeScript
├── frontend/         # React + Vite + TypeScript
├── README.md         # This file
└── .gitignore        # Git ignore rules
```

## Backend Setup

1. Create environment file:

```
cd backend
cp .env.example .env
```

Edit `.env` and set SMTP creds.

2. Install and run:

```
npm install
npm run dev
```

Default server: `http://localhost:3001`

### API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`
- `GET /api/auth/me` (auth)
- `GET /api/menu`
- `GET /api/menu/categories`
- `GET /api/menu/:id`
- `POST /api/order` (auth)
- `GET /api/order/:id` (auth)
- `GET /api/orders/me` (auth)

## Frontend Setup

```
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

### Frontend Routing

- `/intro` welcome screen
- `/login` and `/register` auth pages
- `/menu`, `/cart`, `/orders` are protected by JWT

### Auth Flow

- After login/OTP verification, token is saved into localStorage
- Axios attaches `Authorization: Bearer <token>` automatically
- On 401 responses, the app auto-logs out

### OTP Notes

- OTP is emailed via SMTP (Gmail supported with app password)
- OTP expires in 5 minutes and is one-time-use

## Notes

- MongoDB URI: `mongodb://localhost:27017/food_ordering`
- For dev, OTP codes are NOT returned in responses.
