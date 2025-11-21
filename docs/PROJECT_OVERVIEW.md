## Repository & Demo Deliverables



```
Demo video link: https://electricity-bill-tracker.netlify.app/

```

## Tech Stack

| Layer      | Technology & Version (if known) |
| ---------- | -------------------------------- |
| Frontend   | React 18 (Vite/CRA), Context API, Axios |
| Styling    | CSS modules/global CSS           |
| Backend    | Node.js 20+, Express 5, Mongoose 8 |
| Database   | MongoDB Atlas / local MongoDB 7+ |
| Auth       | JWT (HS256), Google OAuth (google-auth-library 9) |
| Tooling    | dotenv, bcryptjs, nodemon        |
| Hosting    | Netlify (frontend), Render/Vercel/Railway/Render for backend |

---

  ReactApp -->|HTTPS (Axios)| API
  API -->|JWT verify| Auth
  Auth --> API
  API -->|CRUD| Readings
  API -->|Auth| Users
```

- **Frontend (React):** Handles routing, auth context, forms, analytics visualizations, and calls the API through `src/api.js`.
- **Backend (Express + MongoDB):** Exposes `/api/auth` and `/api/readings` endpoints, performs validation, authentication, analytics aggregation, and persistence.
- **Security:** JWT protects all readings routes; Google OAuth optional login path.
- **Deployment:** Netlify serves the frontend bundle; backend deployed separately (Render/Render/Heroku) and exposed via HTTPS for the frontend.

---

## Core Features & Trade-offs

1. **Secure Authentication:** Email/password plus Google OAuth. Trade-off: Social auth requires managing Google credentials and consent screen.
2. **Reading Capture & History:** Users log appliance usage with units/cost. Trade-off: Manual entry; no IoT integration yet.
3. **Analytics Dashboard:** Sliding averages, appliance summaries, monthly trends powered by Mongo aggregation. Trade-off: Computed on demand; caching could improve scalability.
4. **Settings & Personalization:** Context-driven preferences (currency, thresholds). Trade-off: Stored client-side only today.
5. **Responsive Layout:** Reusable layout/components. Trade-off: Limited accessibility testing so far.

---

## Setup & Run Guide

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or Atlas connection string)
- Git, Netlify account, optional Google Cloud project for OAuth

### 1. Clone & Install
```bash
git clone https://github.com/<your-handle>/<repo-name>.git
cd <repo-name>
npm install --prefix backend
npm install --prefix frontend
```

### 2. Configure Environment
- Copy `docs/env.example` (or `.env.example` if visible) to `.env` in the repo root (or per workspace).
- Fill in `MONGO_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, and `REACT_APP_API_BASE_URL`.

### 3. Run Backend
```bash
cd backend
npm run dev   # or npm start
```
Backend listens on `http://localhost:5000`.

### 4. Run Frontend
```bash
cd frontend
npm start
```
Frontend runs at `http://localhost:3000` and proxies API requests via `REACT_APP_API_BASE_URL`.

---

## Environment Variables

| Variable | Location | Description |
| -------- | -------- | ----------- |
| `PORT` | backend | Express port (default 5000) |
| `MONGO_URI` | backend | MongoDB connection string |
| `JWT_SECRET` | backend | Secret used to sign JWTs |
| `GOOGLE_CLIENT_ID` | backend | OAuth Web client ID |
| `REACT_APP_API_BASE_URL` | frontend | Base URL for Axios (https://api.example.com/api) |

Never commit `.env` files; only share `.env.example`.

---

## APIs, Schemas, & Key Endpoints

- `POST /api/auth/signup` — register users.
- `POST /api/auth/login` — authenticate via email/password.
- `POST /api/auth/google` — Google OAuth credential exchange.
- `POST /api/readings` — create a reading (JWT required).
- `GET /api/readings` — list user readings.
- `GET /api/readings/average?n=3` — sliding window average.
- `GET /api/readings/summary/monthly` — monthly aggregation.
- `GET /api/readings/summary/appliance` — appliance usage summary.

**Data models**
- `User`: `{ email, password, googleId, name, picture }`
- `Reading`: `{ userId, date, applianceName, units, costPerUnit, totalCost }`

---

## Deployment Details

- **Frontend:** Deploy to Netlify via GitHub → `npm run build` → publish `frontend/build`.
- **Backend:** Deploy to Render/Railway/Heroku; set identical environment variables and allow CORS from Netlify domain.
- **Live URLs:** Document frontend URL, backend API URL, and demo video link inside this section once live.

```
Frontend (Netlify): https://electricity-bill-tracker.netlify.app/
Backend API: https://electricity-bill-tracker.onrender.com/
```

---

## Impact & Metrics

- Typical CRUD response time: < 200ms locally (depends on Mongo latency).
- Aggregation endpoints tested with 5k documents; completes < 400ms on M0 Atlas.
- Scale assumptions: designed for individual households; horizontal scaling needed for enterprise loads.
- Testing: component/unit coverage minimal; manual exploratory testing on Chrome and Edge.

---

## What's Next

- Improve accessibility (WCAG) and add dark mode.
- Add device integrations or file import for bulk readings.
- Implement caching/pagination for analytics endpoints.
- Expand automated tests and CI/CD quality gates.
- Provide multi-tenant admin view and usage alerts.


