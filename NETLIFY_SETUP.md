# Netlify Deployment Setup Guide

## Step 1: Set Environment Variables in Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the following variables:

### Required Variables:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `REACT_APP_API_BASE_URL` | `https://electricity-bill-tracker.onrender.com/api` | Your backend API URL (must end with `/api`) |
| `REACT_APP_GOOGLE_CLIENT_ID` | `your-google-client-id.apps.googleusercontent.com` | Your Google OAuth Client ID |

**Important:** 
- Replace `https://electricity-bill-tracker.onrender.com/api` with your actual Render backend URL
- Make sure your backend URL ends with `/api`
- The Google Client ID should be from Google Cloud Console

## Step 2: Fix Google OAuth Error (origin_mismatch)

The error "Error 400: origin_mismatch" means your Netlify URL is not authorized in Google Cloud Console.

### Steps to Fix:

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Select your project (or create one if you don't have it)

2. **Navigate to OAuth Settings:**
   - Go to **APIs & Services** → **Credentials**
   - Find your OAuth 2.0 Client ID (the one you're using)
   - Click on it to edit

3. **Add Authorized JavaScript Origins:**
   - Under **Authorized JavaScript origins**, click **+ ADD URI**
   - Add your Netlify URL: `https://your-site-name.netlify.app`
   - Also add: `https://your-site-name.netlify.app/` (with trailing slash)
   - Click **SAVE**

4. **Add Authorized Redirect URIs (if needed):**
   - Under **Authorized redirect URIs**, add:
   - `https://your-site-name.netlify.app`
   - `https://your-site-name.netlify.app/login`
   - `https://your-site-name.netlify.app/callback`

5. **Wait a few minutes** for changes to propagate

6. **Test again** - The Google Sign-In should work now

## Step 3: Verify Backend is Running on Render

1. Check your Render dashboard
2. Make sure your backend service is **Running** (not sleeping)
3. Test the backend URL directly:
   - Visit: `https://electricity-bill-tracker.onrender.com/api`
   - You should see: `{"message":"Electricity Bill Tracker API running"}`

## Step 4: Redeploy Netlify Site

After setting environment variables:

1. Go to Netlify dashboard
2. Click **Deploys** tab
3. Click **Trigger deploy** → **Deploy site**
4. Wait for build to complete

## Troubleshooting

### Backend Server Error:
- **Check Render logs:** Go to Render dashboard → Your service → Logs
- **Verify backend URL:** Make sure `REACT_APP_API_BASE_URL` in Netlify matches your Render URL
- **Check CORS:** Backend should allow requests from your Netlify domain

### Google OAuth Not Working:
- **Verify Client ID:** Make sure `REACT_APP_GOOGLE_CLIENT_ID` is set correctly in Netlify
- **Check Authorized Origins:** Your Netlify URL must be in Google Cloud Console
- **Wait for propagation:** Google changes can take 5-10 minutes to take effect

### Build Fails:
- Check build logs in Netlify
- Make sure all environment variables are set
- Verify your code is pushed to GitHub

## Quick Checklist

- [ ] `REACT_APP_API_BASE_URL` set in Netlify (your Render backend URL + `/api`)
- [ ] `REACT_APP_GOOGLE_CLIENT_ID` set in Netlify
- [ ] Netlify URL added to Google Cloud Console Authorized JavaScript origins
- [ ] Backend is running on Render
- [ ] Netlify site redeployed after setting environment variables
- [ ] Test login and Google authentication

