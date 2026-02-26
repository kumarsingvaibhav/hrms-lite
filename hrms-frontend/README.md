# HRMS Lite — Frontend

> React + Vite frontend for the HRMS Lite HR Management System.
> Connects to a FastAPI + MongoDB backend.

---

## Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Framework   | React 18                |
| Build Tool  | Vite 5                  |
| HTTP Client | Native fetch (no axios) |
| Styling     | Inline styles + CSS variables |
| Fonts       | DM Sans + DM Mono (Google Fonts) |
| Deployment  | Vercel / Netlify        |

---

## Folder Structure

```
src/
├── api/
│   ├── client.js          # Base fetch wrapper — URL config, error normalisation
│   ├── employees.js       # Employee API calls
│   ├── attendance.js      # Attendance API calls
│   └── dashboard.js       # Dashboard stats API call
├── components/
│   ├── common/
│   │   ├── Icon.jsx           # Inline SVG icons
│   │   ├── Toast.jsx          # Toast notification container
│   │   ├── Spinner.jsx        # Loading spinner
│   │   ├── SkeletonRows.jsx   # Table skeleton loader
│   │   ├── EmptyState.jsx     # Empty list state
│   │   ├── ConfirmDialog.jsx  # Delete confirmation modal
│   │   └── ErrorBanner.jsx    # API error display
│   ├── layout/
│   │   ├── Sidebar.jsx        # Fixed left navigation
│   │   └── Header.jsx         # Sticky page header
│   ├── dashboard/
│   │   └── StatCard.jsx       # Summary stat card
│   ├── employees/
│   │   ├── EmployeeAvatar.jsx # Coloured initials avatar
│   │   ├── DeptChip.jsx       # Department badge
│   │   └── AddEmployeeModal.jsx # Create employee form modal
│   └── attendance/
│       └── AttendanceBadge.jsx # Present/Absent status badge
├── hooks/
│   ├── useToast.js            # Toast state management
│   └── useAsync.js            # Generic async fetch hook
├── pages/
│   ├── DashboardPage.jsx      # Stats + recent employees
│   ├── EmployeesPage.jsx      # Full employee table + CRUD
│   ├── AttendancePage.jsx     # Mark attendance (bulk)
│   └── AttendanceHistoryPage.jsx # Per-employee log + stats
├── utils/
│   └── helpers.js             # Date formatting, avatar utils
├── styles/
│   └── global.css             # CSS variables + reset
├── App.jsx                    # Root — navigation state
└── main.jsx                   # React DOM entry point
```

---

## API Endpoints Used

| Page                | Method | Endpoint                                    |
|---------------------|--------|---------------------------------------------|
| Dashboard           | GET    | `/api/v1/dashboard`                         |
| Employees           | GET    | `/api/v1/employees`                         |
| Add Employee        | POST   | `/api/v1/employees`                         |
| Delete Employee     | DELETE | `/api/v1/employees/:id`                     |
| Mark Attendance     | POST   | `/api/v1/attendance`                        |
| History             | GET    | `/api/v1/attendance/employee/:id`           |
| Summary Stats       | GET    | `/api/v1/attendance/employee/:id/summary`   |

---

## Local Setup

### Prerequisites
- Node.js 18+
- Running HRMS backend on `http://localhost:8000`

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
# .env.development is pre-configured to proxy /api → localhost:8000
# No changes needed for local dev.

# 3. Start dev server
npm run dev
# App at http://localhost:5173
```

The Vite proxy (`vite.config.js`) forwards all `/api` requests to `http://localhost:8000` during development, so no CORS issues.

---

## Production Build

```bash
npm run build
# Output in /dist — deploy this folder
```

---

## Deployment on Vercel

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Set environment variable:
   - `VITE_API_BASE_URL` = `https://your-backend.onrender.com`
4. Deploy — `vercel.json` handles SPA routing

## Deployment on Netlify

1. Push to GitHub
2. Import on [netlify.com](https://app.netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Set environment variable: `VITE_API_BASE_URL`
6. `netlify.toml` handles SPA routing redirects

---

## Connecting to the Backend

Edit `.env.production`:

```env
VITE_API_BASE_URL=https://your-hrms-backend.onrender.com
```

The `api/client.js` prepends this to all requests:
```
GET https://your-backend.onrender.com/api/v1/employees
```

---

## Assumptions

- No authentication (single admin user per spec)
- Client-side navigation (no React Router — keeps bundle lean)
- All styling via CSS custom properties — no Tailwind/MUI dependency
- API error messages are shown directly to the admin (trusted internal tool)
