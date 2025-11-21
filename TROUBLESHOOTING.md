# Troubleshooting Guide

## Issue: "Google login failed" or "Server error" on login

### Step 1: Verify Netlify Environment Variables

1. Go to Netlify Dashboard → Your Site → **Site settings** → **Environment variables**
2. Check that these are set correctly:
   - `REACT_APP_API_BASE_URL` = `https://electricity-bill-tracker.onrender.com/api`
     - **Important:** Must end with `/api` (no trailing slash before `/api`)
     - **Wrong:** `https://electricity-bill-tracker.onrender.com/api/`
     - **Correct:** `https://electricity-bill-tracker.onrender.com/api`
   - `REACT_APP_GOOGLE_CLIENT_ID` = Your Google Client ID

3. **After changing environment variables, you MUST redeploy:**
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**

### Step 2: Check if Backend is Running on Render

1. Go to Render Dashboard: https://dashboard.render.com
2. Check your backend service status:
   - If it shows **"Sleeping"** → Click **Manual Deploy** or wait for it to wake up (first request takes ~30 seconds)
   - If it shows **"Failed"** → Check logs and fix the issue
   - If it shows **"Running"** → Backend should be working

3. Test backend directly:
   - Visit: `https://electricity-bill-tracker.onrender.com/api`
   - Should see: `{"message":"Electricity Bill Tracker API running"}`
   - If you get an error, the backend is not running properly

### Step 3: Check Render Logs

1. In Render Dashboard → Your Service → **Logs** tab
2. Look for errors related to:
   - MongoDB connection
   - Missing environment variables
   - Port issues
   - Google OAuth configuration

### Step 4: Verify Backend Environment Variables on Render

In Render Dashboard → Your Service → **Environment** tab, make sure you have:

- `MONGO_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secret string for JWT tokens
- `GOOGLE_CLIENT_ID` - Your Google OAuth Client ID (must match the one in Netlify)
- `PORT` - Usually set automatically by Render (5000 or 10000)

### Step 5: Test API Endpoints Directly

Open browser console (F12) and test:

```javascript
// Test 1: Check if API is reachable
fetch('https://electricity-bill-tracker.onrender.com/api')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Test 2: Try login endpoint (will fail but shows if endpoint exists)
fetch('https://electricity-bill-tracker.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com', password: 'test' })
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### Step 6: Check Browser Console

1. Open your Netlify site
2. Press F12 to open Developer Tools
3. Go to **Console** tab
4. Try to login
5. Look for error messages - they will show:
   - Network errors (CORS, connection refused)
   - API URL being used
   - Detailed error messages

### Common Issues and Solutions

#### Issue: "Network Error" or "Failed to fetch"
**Cause:** Backend is sleeping or not accessible
**Solution:** 
- Wake up backend on Render (make a request or manual deploy)
- Wait 30 seconds for first request
- Check if backend URL is correct

#### Issue: "CORS error"
**Cause:** Backend not allowing requests from Netlify domain
**Solution:** 
- Backend should have `app.use(cors())` which allows all origins
- If still getting CORS error, check Render logs

#### Issue: "Google login failed" with specific error
**Cause:** Google OAuth configuration issue
**Solution:**
- Verify `GOOGLE_CLIENT_ID` matches in both Netlify and Render
- Check Google Cloud Console - make sure Netlify URL is in authorized origins
- Check Render logs for Google OAuth errors

#### Issue: "Server error" on email login
**Cause:** Backend error (MongoDB, missing env vars, etc.)
**Solution:**
- Check Render logs for detailed error
- Verify MongoDB connection string is correct
- Verify all environment variables are set in Render

### Step 7: Verify API URL Format

The API URL must be exactly:
```
https://electricity-bill-tracker.onrender.com/api
```

**NOT:**
- `https://electricity-bill-tracker.onrender.com/api/` (trailing slash)
- `https://electricity-bill-tracker.onrender.com/` (missing /api)
- `http://electricity-bill-tracker.onrender.com/api` (http instead of https)

### Quick Checklist

- [ ] `REACT_APP_API_BASE_URL` set in Netlify (ends with `/api`, no trailing slash)
- [ ] `REACT_APP_GOOGLE_CLIENT_ID` set in Netlify
- [ ] Backend is **Running** (not Sleeping) on Render
- [ ] Backend URL works: `https://electricity-bill-tracker.onrender.com/api`
- [ ] All environment variables set in Render (MONGO_URI, JWT_SECRET, GOOGLE_CLIENT_ID)
- [ ] Netlify site redeployed after setting environment variables
- [ ] Check browser console for detailed error messages
- [ ] Check Render logs for backend errors

