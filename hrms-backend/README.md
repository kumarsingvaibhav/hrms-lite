# HRMS Lite — Backend

> Lightweight HR Management System API built with **FastAPI + Motor (async MongoDB)**.

---

## Tech Stack

| Layer      | Technology                     |
|------------|--------------------------------|
| Framework  | FastAPI 0.111                  |
| Runtime    | Python 3.11+                   |
| Database   | MongoDB (via Motor async driver)|
| Validation | Pydantic v2                    |
| Server     | Uvicorn                        |
| Deployment | Render / Railway               |

---

## Folder Structure

```
hrms-backend/
├── app/
│   ├── core/
│   │   ├── config.py          # Settings from .env
│   │   ├── database.py        # Motor connection + index bootstrap
│   │   └── responses.py       # Standard JSON envelopes
│   ├── models/
│   │   ├── employee.py        # Pydantic schemas (Create / DB / Out)
│   │   └── attendance.py      # Pydantic schemas (Create / Out / Summary)
│   ├── repositories/
│   │   ├── employee_repository.py    # Raw MongoDB operations
│   │   └── attendance_repository.py  # Raw MongoDB operations
│   ├── services/
│   │   ├── employee_service.py       # Business logic
│   │   └── attendance_service.py     # Business logic
│   ├── routes/
│   │   ├── employees.py       # GET/POST/DELETE /api/v1/employees
│   │   ├── attendance.py      # POST/GET /api/v1/attendance
│   │   └── dashboard.py       # GET /api/v1/dashboard
│   ├── middleware/
│   │   └── error_handler.py   # Centralised exception handling
│   └── main.py                # App factory
├── tests/
│   └── test_api.py            # Integration tests
├── run.py                     # Dev server entry point
├── requirements.txt
├── render.yaml                # Render deployment config
└── .env.example
```

---

## API Endpoints

### Health
| Method | Path      | Description        |
|--------|-----------|--------------------|
| GET    | `/health` | Health check       |

### Dashboard
| Method | Path                | Description                  |
|--------|---------------------|------------------------------|
| GET    | `/api/v1/dashboard` | Summary stats for today      |

### Employees
| Method | Path                          | Description                      |
|--------|-------------------------------|----------------------------------|
| GET    | `/api/v1/employees`           | List all employees               |
| POST   | `/api/v1/employees`           | Create new employee              |
| GET    | `/api/v1/employees/{id}`      | Get single employee              |
| DELETE | `/api/v1/employees/{id}`      | Delete employee (cascades att.)  |

### Attendance
| Method | Path                                        | Description                    |
|--------|---------------------------------------------|--------------------------------|
| POST   | `/api/v1/attendance`                        | Mark attendance                |
| GET    | `/api/v1/attendance/employee/{id}`          | History for one employee       |
| GET    | `/api/v1/attendance/employee/{id}/summary`  | Stats (present/absent/rate)    |
| GET    | `/api/v1/attendance/date/{YYYY-MM-DD}`      | All records on a date          |

---

## Response Envelope

Every endpoint returns the same envelope:

```json
{
  "success": true,
  "message": "Human-readable status message",
  "data": { ... }
}
```

Errors follow the same shape with `"success": false`.

---

## HTTP Status Codes

| Code | Meaning                        |
|------|--------------------------------|
| 200  | OK                             |
| 201  | Created                        |
| 400  | Bad Request                    |
| 404  | Not Found                      |
| 409  | Conflict (duplicate)           |
| 422  | Validation Error               |
| 500  | Internal Server Error          |

---

## Local Setup

### Prerequisites
- Python 3.11+
- MongoDB running locally (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### Steps

```bash
# 1. Clone and enter directory
git clone <your-repo>
cd hrms-backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
# Edit .env — set MONGODB_URL and ALLOWED_ORIGINS

# 5. Run development server
python run.py or uvicorn app.main:app --reload
# API available at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

---

## Running Tests

```bash
pip install pytest pytest-asyncio httpx
pytest tests/ -v
```

---

## Deployment on Render

1. Push code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect your GitHub repo
4. Set environment variables in Render dashboard:
   - `MONGODB_URL` → your MongoDB Atlas connection string
   - `MONGODB_DB_NAME` → `hrms_lite`
   - `ALLOWED_ORIGINS` → your Vercel/Netlify frontend URL
   - `DEBUG` → `False`
5. Build Command: `pip install -r requirements.txt`
6. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 2`

---

## MongoDB Atlas Setup

1. Create free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Allow network access (0.0.0.0/0 for Render)
4. Copy the connection string → set as `MONGODB_URL`

The app auto-creates all collections and indexes on first startup.

---

## Connecting to the React Frontend

Set these in your React `.env`:

```env
VITE_API_URL=https://your-backend.onrender.com/api/v1
```

Then replace the `api` object in the frontend with real `fetch()` calls to the above endpoints.

---

## Assumptions

- Single admin user (no authentication required per spec)
- Attendance dates stored as ISO-8601 strings in MongoDB
- Employee IDs are uppercase alphanumeric (e.g. EMP001)
- Cascade delete: removing an employee also removes all their attendance records
- MongoDB Atlas free tier is sufficient for this workload
