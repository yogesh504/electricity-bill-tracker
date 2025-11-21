# Fix Google OAuth 500 Error

## The Problem
You're getting a 500 error when trying to login with Google. This is usually caused by:

1. **Missing `GOOGLE_CLIENT_ID` in Render** - The backend needs this to verify Google tokens
2. **Mismatched Client IDs** - Frontend and backend using different Google Client IDs
3. **MongoDB connection issue** - Database not connected properly

## Step 1: Check Render Environment Variables

1. Go to **Render Dashboard**: https://dashboard.render.com
2. Click on your **backend service**
3. Go to **Environment** tab
4. Check if `GOOGLE_CLIENT_ID` is set:
   - It should be the same value as `REACT_APP_GOOGLE_CLIENT_ID` in Netlify
   - Format: `123456789-abc123def456.apps.googleusercontent.com`
   - **No quotes, no spaces**

## Step 2: Verify Google Client ID Matches

**In Netlify:**
- Go to Site settings → Environment variables
- Check `REACT_APP_GOOGLE_CLIENT_ID`

**In Render:**
- Go to Environment tab
- Check `GOOGLE_CLIENT_ID`

**They must be EXACTLY the same!**

## Step 3: Check Render Logs

1. In Render Dashboard → Your Service → **Logs** tab
2. Look for errors like:
   - `GOOGLE_CLIENT_ID environment variable is missing`
   - `MongoDB connection error`
   - `Google token verification error`

## Step 4: Common Issues

### Issue 1: Missing GOOGLE_CLIENT_ID in Render
**Solution:**
1. Go to Render → Environment tab
2. Add new variable:
   - Key: `GOOGLE_CLIENT_ID`
   - Value: Your Google Client ID (same as Netlify)
3. Save and redeploy

### Issue 2: MongoDB Not Connected
**Solution:**
1. Check `MONGO_URI` in Render environment variables
2. Make sure MongoDB connection string is correct
3. Check Render logs for MongoDB errors

### Issue 3: Google Client ID Mismatch
**Solution:**
1. Make sure both Netlify and Render use the SAME Google Client ID
2. Get it from Google Cloud Console:
   - Go to https://console.cloud.google.com
   - APIs & Services → Credentials
   - Copy the OAuth 2.0 Client ID

## Step 5: Test After Fixing

1. **Redeploy Render** after adding/changing environment variables
2. **Wait for deployment to complete**
3. **Try Google login again**
4. **Check browser console** (F12) for detailed error messages

## Quick Checklist

- [ ] `GOOGLE_CLIENT_ID` is set in Render (Environment tab)
- [ ] `GOOGLE_CLIENT_ID` in Render matches `REACT_APP_GOOGLE_CLIENT_ID` in Netlify
- [ ] `MONGO_URI` is set correctly in Render
- [ ] `JWT_SECRET` is set in Render
- [ ] Backend service is **Running** (not Failed) on Render
- [ ] Checked Render logs for specific error messages
- [ ] Redeployed Render after changing environment variables

## How to Get Your Google Client ID

1. Go to **Google Cloud Console**: https://console.cloud.google.com
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Find your **OAuth 2.0 Client ID**
5. Copy the **Client ID** (not the Client Secret)
6. It looks like: `123456789-abc123def456.apps.googleusercontent.com`

## After Fixing

Once you've set the environment variables correctly:
1. **Redeploy Render** (go to Manual Deploy → Deploy latest commit)
2. Wait for deployment
3. Try Google login again
4. Check browser console for any remaining errors

