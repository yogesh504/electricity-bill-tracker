## Overview

Follow these steps to make the project public on GitHub and deploy the frontend to Netlify (plus optional backend host like Render/Railway). Commands assume PowerShell on Windows.

---

## 1. Prepare Local Project
1. Open PowerShell.
2. `Set-Location "D:\ドキュメント\webd\summer training project - Copy - Copy"`.
3. Install dependencies:
   - `npm install --prefix backend`
   - `npm install --prefix frontend`
4. Run locally:
   - Backend: `npm run dev --prefix backend`
   - Frontend: `npm start --prefix frontend`
5. Verify `.env` values are configured and app works end-to-end.

---

## 2. Initialize Git
```powershell
git init
git status
git add .
git commit -m "Initial project snapshot"
```

> If a repo already exists, skip `git init` and ensure your branch is up to date.

---

## 3. Push to GitHub
1. Create a new empty repository on GitHub (no README/license).
2. Back in PowerShell:
   ```powershell
   git remote add origin https://github.com/<username>/<repo>.git
   git branch -M main
   git push -u origin main
   ```
3. Update `docs/REPO_LINK.txt` with the public URL.

---

## 4. Deploy Backend (Render/Railway/Vercel)
1. Choose a Node-compatible host (Render Web Service example):
   - Connect GitHub repo.
   - Select `backend` directory for build context.
   - Build command: `npm install`  
     Start command: `npm start`
2. Configure environment variables (`PORT`, `MONGO_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`).
3. Enable CORS to allow the Netlify domain.
4. After deploy, note the public API URL (e.g., `https://electricity-api.onrender.com`).

---

## 5. Deploy Frontend to Netlify
1. Log in to https://app.netlify.com.
2. Click **Add new site → Import an existing project**.
3. Select GitHub → authorize → choose the repo.
4. Configure:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `build`
   - Environment variables: set `REACT_APP_API_BASE_URL` to your backend URL plus `/api`.
5. Deploy. Netlify builds from GitHub and outputs a live URL (`https://your-site.netlify.app`).
6. Under **Site settings → Domain management**, customize the site name or add a custom domain.

---

## 6. Demo Video & Documentation
1. Record a 3–6 minute walkthrough (problem, solution, feature demo, next steps).
2. Upload to YouTube (unlisted) or Drive and paste the link in `docs/PROJECT_OVERVIEW.md`.
3. Ensure `docs/REPO_LINK.txt`, `docs/PROJECT_OVERVIEW.md`, and `docs/env.example` are committed.

---

## 7. Continuous Deployment Workflow
- Every push to `main` triggers:
  - GitHub updates (source of truth).
  - Netlify build (frontend).
  - Optional Render/Railway auto-deploy (backend) if configured.
- Use feature branches + pull requests to maintain history.

---

## 8. Verification Checklist
- [ ] GitHub repo is public and viewable.
- [ ] `docs/REPO_LINK.txt` contains the live repo URL.
- [ ] Netlify site reachable and points to production API.
- [ ] Backend host responds at `/api`.
- [ ] Demo video link accessible to reviewers.
- [ ] `.env` kept local; only `docs/env.example` committed.

Once everything passes, share the repo link, Netlify URL, API URL, and demo video with reviewers. Continuous deployment will keep the live site current whenever you push updates. 

