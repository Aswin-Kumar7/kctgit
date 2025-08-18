# 🍴 Food Ordering System  

A **full-stack food ordering application** built with modern technologies:  

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white" />
</p>

---

## ✨ Features

- 🍽️ Browse menu items by category  
- 🛒 Add to cart with quantity control  
- 💳 Place orders with automatic total calculation  
- 📋 View order history & order details  
- 🔐 Secure authentication with **JWT + Email OTP**  
- 🎨 Modern UI built with **TailwindCSS**  
- 🔒 Fully type-safe development with **TypeScript**

---

## 📂 Project Structure

```
food-ordering-system/
├── backend/          # Node.js + Express + TypeScript (API + Auth + DB)
├── frontend/         # React + Vite + TypeScript (UI)
├── README.md         # Documentation
└── .gitignore        # Ignored files
```

---

## 🚀 Backend Setup

### 1. Clone & Install

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file in `backend/` and update values:  

```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/food_ordering
JWT_SECRET=your_secret_key
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

📌 **Note:**  
- For Gmail, generate an **App Password** instead of using your main password.  
- MongoDB should be running locally (`mongod`).  

### 3. Start the Backend

```bash
npm run dev
```

👉 Backend runs at: `http://localhost:3001`  

APIs available:  
- 📖 Health check → `/health`  
- 🍽️ Menu → `/api/menu`  
- 🔐 Auth → `/api/auth`  
- 📋 Orders → `/api/order`  

---

## 🎨 Frontend Setup

```
cd frontend
npm install
npm run dev
```

👉 Open [http://localhost:5173](http://localhost:5173) in browser  

---

## 🔑 Auth Flow

- On **login/register**, OTP is sent via email  
- OTP is valid for **5 minutes** (one-time use)  
- On success → JWT token saved in `localStorage`  
- Axios automatically adds `Authorization: Bearer <token>`  
- On `401 Unauthorized`, the app logs out automatically  

---

## 🛠️ Troubleshooting

- **MongoDB not connecting?** → Check `mongod` is running on default port.  
- **Email OTP not sending?** → Make sure:  
  - Gmail App Password is set in `.env`  
  - Less secure app access is allowed (if using non-Google SMTP).  
- **Frontend not opening?** → Ensure port `5173` is not blocked.  

---

## 📌 Notes

- Default MongoDB: `mongodb://localhost:27017/food_ordering`  
- For development, OTP is **also printed in terminal** for quick testing.  

---
