# 🧠 Foodies API

> **Foodies API** is the powerful backend that supports the [Foodies App](https://foodies-fe-8wvc.vercel.app) — a modern recipe-sharing platform built to bring food lovers together.

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.MD)
[![API Docs](https://img.shields.io/badge/api-docs-blue?logo=swagger)](https://foodies-be-oruu.onrender.com/api-docs/)

> 🍽️ This is the brain behind the food — a clean, secure, and scalable RESTful API serving recipes, users, and tasty interactions!

---

## 🔧 What is Foodies API?

The **Foodies API** is a RESTful backend service that powers everything in the Foodies ecosystem: user accounts, recipe creation, authentication, social features, and more. Built for performance and designed with modularity in mind, it’s the secret sauce behind the frontend.

---

## 📦 Features

* 🔐 **Authentication & Authorization** (JWT-based)
* 📚 **Swagger UI** – auto-generated, interactive API docs
* 🥘 **Recipe CRUD** – create, update, delete, and explore recipes
* 🧑‍🤝‍🧑 **User Management** – profiles, followers, settings
* ❤️ **Favorites & Testimonials** – mark and review recipes you love
* 📊 **Pagination & Filtering** – performant access to large data sets
* 🧪 **Ready for Testing & Deployment** – perfect for staging or scale-up

---

## 📘 API Documentation

Check out our live Swagger UI to explore and test endpoints in your browser:

> 🔗 **[Swagger Docs](https://foodies-be-oruu.onrender.com/api-docs/)**

Includes:

* Auth routes (register, login, logout)
* Recipe endpoints (CRUD)
* User profile/following
* Testimonials
* Favorites
* Pagination & filtering

---

## 🚀 Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/MKuzich/foodies-be.git
cd foodies-be
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in the `.env` file with your database credentials, JWT secret, and other values.

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
npm run dev
```

The server will run at `http://localhost:3000` (or whatever port you set).

---

## ⚙️ Tech Stack

* **Framework**: Node.js + Express
* **Database**: PostgreSQL
* **Auth**: JWT tokens + middleware-based route protection
* **Docs**: Swagger (OpenAPI)
* **Validation**: Yup
* **Environment Config**: dotenv
* **Deployment-ready** with Render

---

## 🙌 Contributing

Want to help grow the API? We’d love your support! 🛠️

1. Fork the repo
2. Create a new branch
3. Make your changes
4. Submit a pull request ✅

---

## 🌎 Roadmap

Coming soon:

* 🍩 Image upload support for recipes
* 🛡️ Rate limiting & security enhancements
* 🌍 i18n/multi-language support
* 📨 Email verification & password reset
* 🧠 Improved recommendation algorithm
* 📈 Admin dashboard with analytics

We are open to suggestions and contributions!

---

Whether you're building your own version of Foodies or contributing to something delicious — this API is made to serve 🍽️

> **Built with care 🛠️ and plenty of coffee ☕ by ProTeam2**