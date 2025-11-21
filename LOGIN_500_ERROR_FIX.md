# Fix Login 500 Error

## The Problem
You're getting a 500 (Server Error) when trying to login with email/password. This usually means the backend is crashing when processing the login request.

## Most Common Causes

### 1. MongoDB Not Connected (Most Common)
**Symptoms:**
- 500 error on login
- Backend logs show "MongoDB connection error"
- Health check shows MongoDB disconnected

**Solution:**
1. Go to **Render Dashboard** → Your Service → **Environment** tab
2. Check `MONGO_URI` is set correctly:
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database`
   - Or: `mongodb://localhost:27017/database` (for local)
3. Make sure MongoDB connection string is valid
4. Check Render logs for MongoDB connection errors

### 2. Missing Environment Variables
**Solution:**
Check Render Environment tab has:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Any secret string (e.g., "my-secret-key-123")
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID (optional for email login)

### 3. Database Query Error
**Symptoms:**
- Backend logs show database errors
- User.findOne() failing

**Solution:**
- Check MongoDB connection
- Verify database name is correct
- Check if MongoDB service is running (if using MongoDB Atlas, check cluster status)

## Step-by-Step Fix

### Step 1: Check Render Logs
1. Go to **Render Dashboard** → Your Service → **Logs** tab
2. Try to login
3. Look for error messages in the logs
4. Common errors:
   - `MongoDB connection error`
   - `MongooseError: ...`
   - `JWT_SECRET is required`

### Step 2: Test Health Endpoint
Visit: `https://electricity-bill-tracker.onrender.com/api/health`

You should see:
```json
{
  "status": "ok",
  "mongodb": {
    "status": "connected",
    "connected": true
  },
  "timestamp": "..."
}
```

If `mongodb.connected` is `false`, MongoDB is not connected!

### Step 3: Verify Environment Variables in Render

Go to Render → Environment tab and check:

| Variable | Required | Example |
|----------|----------|---------|
| `MONGO_URI` | ✅ Yes | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | ✅ Yes | `my-secret-key-123` |
| `GOOGLE_CLIENT_ID` | ⚠️ Optional | `123-abc.apps.googleusercontent.com` |

### Step 4: Check MongoDB Connection String Format

**MongoDB Atlas (Cloud):**
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**Local MongoDB:**
```
mongodb://localhost:27017/electricityTracker
```

**Important:**
- Replace `username`, `password`, `cluster`, and `database` with your actual values
- Make sure password is URL-encoded if it has special characters
- No quotes around the connection string

### Step 5: Test MongoDB Connection

1. Check if MongoDB Atlas cluster is running (if using Atlas)
2. Verify network access:
   - MongoDB Atlas → Network Access → Add IP `0.0.0.0/0` (allow all) for testing
3. Test connection string locally if possible

### Step 6: Redeploy Backend

After fixing environment variables:
1. Go to Render → Manual Deploy
2. Click "Deploy latest commit"
3. Wait for deployment
4. Check logs to see "MongoDB connected" message

## Quick Checklist

- [ ] `MONGO_URI` is set in Render (Environment tab)
- [ ] `MONGO_URI` format is correct (starts with `mongodb://` or `mongodb+srv://`)
- [ ] `JWT_SECRET` is set in Render
- [ ] MongoDB cluster is running (if using Atlas)
- [ ] Network access allows Render IPs (MongoDB Atlas)
- [ ] Backend service shows "Running" (not Failed) on Render
- [ ] Health check shows MongoDB connected: `/api/health`
- [ ] Checked Render logs for specific error messages
- [ ] Redeployed backend after fixing environment variables

## How to Get MongoDB Connection String

### MongoDB Atlas (Recommended for Production):
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account or login
3. Create a cluster (free tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with your database name

### Local MongoDB:
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `mongodb://localhost:27017/electricityTracker`

## Testing After Fix

1. **Test health endpoint:**
   ```
   https://electricity-bill-tracker.onrender.com/api/health
   ```
   Should show MongoDB connected: true

2. **Test login:**
   - Go to your Netlify site
   - Try to login
   - Check browser console (F12) for error details
   - Check Render logs for backend errors

## Still Not Working?

1. **Check Render logs** - They will show the exact error
2. **Check browser console** (F12) - Shows detailed error from API
3. **Test health endpoint** - Verifies MongoDB connection
4. **Verify all environment variables** are set correctly
5. **Make sure backend is redeployed** after changes

The improved error handling will now show more specific error messages in the response, making it easier to identify the exact problem.

