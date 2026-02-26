# HRMS Lite — Complete Setup & Deployment Guide

A production-grade HR Management System built with **React + FastAPI + MongoDB**.

---

## 📁 Project Structure

```
hrms-lite/
├── hrms-backend/       ← FastAPI + MongoDB backend
└── hrms-frontend/      ← React + Vite frontend
```

---

## 🚀 PART 1 — LOCAL DEVELOPMENT SETUP

### ✅ Prerequisites

| Tool    | Version | Download                                       |
| ------- | ------- | ---------------------------------------------- |
| Python  | 3.11+   | https://python.org/downloads                   |
| Node.js | 18+     | https://nodejs.org                             |
| MongoDB | 7.0     | https://www.mongodb.com/try/download/community |
| Git     | Any     | https://git-scm.com                            |

---

## 🧠 Step 1 — Start MongoDB

### macOS

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Ubuntu/Linux

```bash
sudo apt-get install -y mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

Verify:

```bash
mongosh
```

---

## ⚙️ Step 2 — Backend Setup

```bash
cd hrms-lite/hrms-backend
python -m venv venv
```

Activate:

**Windows**

```bash
venv\Scripts\activate
```

**Mac/Linux**

```bash
source venv/bin/activate
```

Install deps:

```bash
pip install -r requirements.txt
cp .env.example .env
```

`.env`

```env
APP_NAME=HRMS Lite
APP_VERSION=1.0.0
DEBUG=True
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=hrms_lite
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

Run backend:

```bash
python run.py
```

Open:
👉 http://localhost:8000/docs

---

## 🎨 Step 3 — Frontend Setup

```bash
cd hrms-lite/hrms-frontend
npm install
npm run dev
```

Open:
👉 http://localhost:5173

---

## 🌍 PART 2 — DEPLOYMENT

### 🗄 MongoDB Atlas

Create free cluster → create DB user → allow network `0.0.0.0/0` → copy connection string.

---

### ☁️ Backend — Render

Build:

```bash
pip install -r requirements.txt
```

Start:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Env:

```
MONGODB_URL=atlas url
MONGODB_DB_NAME=hrms_lite
DEBUG=False
ALLOWED_ORIGINS=https://your-vercel.app
```

---

### ⚡ Frontend — Vercel

Env:

```
VITE_API_BASE_URL=https://your-backend.onrender.com
```

Build:

```bash
npm run build
```

---

### 🔐 Update CORS

Set in Render:

```
ALLOWED_ORIGINS=https://your-vercel.app
```

Redeploy.

---

## ✅ VERIFY

1. Backend health works
2. Swagger opens
3. Frontend loads
4. CRUD employees works
5. Attendance works

---

## 🛠 TROUBLESHOOTING

**Blank frontend**

* Check console
* Check API URL

**409 error**

* Duplicate employee

**Render sleeping**

* First request slow

**Atlas connection**

* Check network access

---

## 📡 API Endpoints

| Method | URL                               | Purpose |
| ------ | --------------------------------- | ------- |
| GET    | `/health`                         | Health  |
| GET    | `/api/v1/dashboard`               | Stats   |
| GET    | `/api/v1/employees`               | List    |
| POST   | `/api/v1/employees`               | Create  |
| DELETE | `/api/v1/employees/:id`           | Delete  |
| POST   | `/api/v1/attendance`              | Mark    |
| GET    | `/api/v1/attendance/employee/:id` | History |

---

⭐ Built for learning full-stack deployment workflow.
