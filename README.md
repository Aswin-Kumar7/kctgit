# 🍴 KORE - Food Ordering System

A **full-stack food ordering application** built with **TypeScript, Node.js, Express, React, and MongoDB**.  
Modern UI powered by **TailwindCSS** and **JWT Authentication with Email OTP**.

---

## 🚀 Tech Stack

| Frontend | Backend | Database | Auth | Styling |
|----------|---------|----------|------|---------|
| ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB) | ![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white) | ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white) | ![JWT](https://img.shields.io/badge/JWT-black?logo=JSON%20web%20tokens) | ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white) |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) | ![Express](https://img.shields.io/badge/Express.js-404D59?logo=express&logoColor=white) |  | ![Gmail](https://img.shields.io/badge/Gmail-D14836?logo=gmail&logoColor=white) |  |

---

## ✨ Features

- 🍽️ Browse menu items with categories  
- 🛒 Add items to cart with quantity management  
- 💳 Place orders with total calculation  
- 📋 View order details and history
- 📧 Order Summary is shared to mail 
- 🔐 Authentication with JWT and email OTP  
- 🎨 Modern UI with TailwindCSS  
- 🔒 Type-safe development with TypeScript

---

## 📂 Project Structure

```
food-ordering-system/
├── backend/          # Node.js + Express + TypeScript
├── frontend/         # React + Vite + TypeScript
├── README.md         # Documentation
└── .gitignore        # Git ignore rules
```

---

## ⚙️ Backend Setup

1. Navigate and install dependencies:

```bash
cd backend
npm install
```

2. Configure `.env` file:

```env
PORT=3001
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/food_ordering
```

3. Configure `backend/src/config/config.ts` with SMTP credentials:

```ts
smtp: {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  user: 'your-email@gmail.com', 
  pass: 'your-app-password', 
  from: 'Food Ordering <your-email@gmail.com>', 
  allowSelfSigned: false, 
  ignoreTLS: false, 
  devMode: true, 
}
```

4. Run backend server:

```bash
npm run dev
```

Server runs at 👉 `http://localhost:3001`

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at 👉 `http://localhost:5173`

---

## 🔄 Routing Overview

- `/intro` → Welcome screen  
- `/login` & `/register` → Authentication pages  
- `/menu`, `/cart`, `/orders` → Protected routes (JWT required)  

---

## 🔐 Auth Flow

- User registers or logs in via password/otp
- OTP is emailed (via Gmail SMTP with app password)  
- JWT token is stored in **localStorage**  
- Axios auto-attaches token to API requests  
- On `401 Unauthorized`, user is auto-logged out  

---

## 📨 OTP Notes

- OTP expires in **5 minutes**  
- One-time use only  
- For dev mode, OTP is logged in the backend console  

---

## 🛢️ Database

- MongoDB URI: `mongodb://localhost:27017/food_ordering`  
- Uses **Mongoose ODM** for schema & queries  

---

## ❤️ Contributing

PRs are welcome! Fork the repo and submit improvements.

---

## 📜 License

MIT License © 2025 Food Ordering System
