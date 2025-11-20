# Electricity Bill Tracker

Smart web app to log household energy readings, analyze costs, and spot trends with monthly/appliance summaries.

- Demo video (3–6 min): https://YOUR-DEMO-LINK
- Repository: https://github.com/yogesh504/electricity-bill-tracker

> 📌 Full submission details (tech stack, architecture, setup, features, impact, next steps) live in `docs/PROJECT_OVERVIEW.md`.

---

## Quick Start (Local)

```bash
git clone https://github.com/yogesh504/electricity-bill-tracker.git
cd electricity-bill-tracker
npm install --prefix backend
npm install --prefix frontend
copy docs/env.example .env   # or place env files per workspace
npm run dev --prefix backend # http://localhost:5000
npm start --prefix frontend  # http://localhost:3000
```

Environment variables are documented in `docs/env.example`. Never commit real secrets.

---

## Documentation

| Topic | File |
| --- | --- |
| Project overview, tech stack, architecture diagram, core features, setup & run, env vars, API list, deployment details, impact, what’s next | `docs/PROJECT_OVERVIEW.md` |
| Deployment walkthrough (GitHub Desktop, Render/Railway, Netlify) + verification checklist | `docs/DEPLOYMENT_GUIDE.md` |
| View-only repo link reference | `docs/REPO_LINK.txt` |
| Environment template | `docs/env.example` |

---

## Core Features

- Secure auth: email/password + Google OAuth, JWT-protected API.
- CRUD for appliance readings with cost calculations and history view.
- Analytics: sliding averages, monthly totals, appliance breakdowns.
- Responsive React UI with contexts for auth and settings.
- Deployment-ready: documented Netlify + Render setup.

---

## Deliverables Checklist

- [ ] Replace placeholders above with live Netlify URL, backend API, and demo video link.
- [ ] Update `docs/REPO_LINK.txt` with this repo URL and timestamp.
- [ ] Record/upload the demo (3–6 min) covering problem, solution, architecture, walkthrough, impact, and what’s next.
- [ ] Mention deployment URLs in `docs/PROJECT_OVERVIEW.md` once live.

---

## What’s Next

See `docs/PROJECT_OVERVIEW.md` for impact metrics and future improvements (accessibility, integrations, caching, tests, alerts). Pull requests welcome!
