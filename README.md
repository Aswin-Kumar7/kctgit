# 🍴 KORE – Smart Food Ordering System

A **full-stack food ordering application** built using **TypeScript, Node.js, Express, React, and MongoDB**.  
Designed with a **modern UI**, secure **JWT Authentication with Email OTP**, and smooth **admin and user flows**.

🔗 **Live Site:** [https://kore-v1.vercel.app/](https://kore-v1.vercel.app/)

🔒 **Vercel Deployment Repository (Private):** [https://github.com/Aswin-Kumar7/kore](https://github.com/Aswin-Kumar7/kore)

---

## 🚀 Tech Stack

| Frontend | Backend | Database | Auth | Styling |
|-----------|----------|-----------|--------|-----------|
| ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB) | ![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white) | ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white) | ![JWT](https://img.shields.io/badge/JWT-black?logo=JSON%20web%20tokens) | ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white) |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) | ![Express](https://img.shields.io/badge/Express.js-404D59?logo=express&logoColor=white) |  | ![Gmail](https://img.shields.io/badge/Gmail-D14836?logo=gmail&logoColor=white) |  |

---

## ✨ Features

- 🍽️ Browse menu items by category  
- 🛒 Add to cart with quantity management  
- 💳 Place and track orders with total amount calculation  
- 📧 Email order summary on checkout  
- 🔐 Authentication with **JWT** and **Email OTP**  
- 🎨 Sleek UI built with **TailwindCSS**  
- 🔒 **Type-safe development** using TypeScript  
- 👨‍🍳 Admin dashboard for menu & order management  

---

## 📂 Project Structure

```
kore-food-ordering-system/
├── backend/          # Node.js + Express + TypeScript server
├── frontend/         # React + Vite + TypeScript app
├── README.md         # Documentation
└── .gitignore        # Ignored files and folders
```

---

## ⚙️ Backend Setup

1. Navigate to backend folder and install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file:
   ```env
   PORT=3001
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/food_ordering
   JWT_SECRET=your_jwt_secret_key
   ```

3. Update SMTP credentials in `backend/src/config/config.ts`:
   ```ts
   smtp: {
     host: 'smtp.gmail.com',
     port: 587,
     secure: false,
     user: 'your-email@gmail.com',
     pass: 'your-app-password',
     from: 'KORE Food Ordering <your-email@gmail.com>',
     allowSelfSigned: false,
     ignoreTLS: false,
     devMode: true,
   }
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

   Backend runs at 👉 **http://localhost:3001**

---

## 🎨 Frontend Setup

1. Navigate to frontend folder and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

   Frontend runs at 👉 **http://localhost:5173**

---

## 🔄 Routing Overview

| Route | Description |
|-------|--------------|
| `/intro` | Welcome / Splash screen |
| `/login`, `/register` | Authentication pages |
| `/menu`, `/cart`, `/orders` | Protected user routes |
| `/admin/*` | Admin dashboard routes |

---

## 🔐 Authentication Flow

1. User registers or logs in with email/password.  
2. OTP is emailed using **Gmail SMTP (App Password required)**.  
3. OTP is verified within **5 minutes** (one-time use).  
4. On successful verification, a **JWT token** is generated and stored in `localStorage`.  
5. Axios automatically attaches JWT to every API request.  
6. On `401 Unauthorized`, user is auto-logged out.

---

## 🧑‍💼 Admin Login Credentials

| Role | Email | Password |
|------|--------|-----------|
| **Admin** | `admin@kore.com` | `admin1234` |

---

## 👤 User Login & OTP

- Users must **register** or **login** using their email.  
- On login, an **OTP** will be sent to the registered email.  
- The OTP must be entered within **5 minutes** for verification.  
- On success, the user gains access to `/menu`, `/cart`, and `/orders`.

---

## 🛢️ Database

- MongoDB URI:  
  ```bash
  mongodb://localhost:27017/food_ordering
  ```
- Managed via **Mongoose ODM** for schema definitions and queries.  
- Collections include:
  - `users`
  - `menuItems`
  - `orders`
  - `otps`

---

> Developed with ❤️ by **Aswin Kumar**, **Mayakannan**, **Naveen**, and **Smriti**.
