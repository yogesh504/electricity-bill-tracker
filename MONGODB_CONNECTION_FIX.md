# Fix MongoDB Disconnected Error

## Current Status
Your health check shows:
```json
{
  "mongodb": {
    "status": "disconnected",
    "connected": false
  }
}
```

This means MongoDB is **not connected**, which causes all login/signup requests to fail with 500 errors.

## Step 1: Check Render Environment Variables

1. Go to **Render Dashboard**: https://dashboard.render.com
2. Click on your **backend service**
3. Go to **Environment** tab
4. **Check if `MONGO_URI` exists:**
   - If it's **missing** → You need to add it
   - If it exists → Check if the value is correct

## Step 2: Add/Update MONGO_URI

### Option A: Using MongoDB Atlas (Recommended - Free)

1. **Create MongoDB Atlas Account** (if you don't have one):
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up for free
   - Create a free cluster (M0 - Free tier)

2. **Get Connection String:**
   - In MongoDB Atlas, click **"Connect"** on your cluster
   - Choose **"Connect your application"**
   - Copy the connection string
   - It looks like: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

3. **Configure Database User:**
   - In MongoDB Atlas → **Database Access** → **Add New Database User**
   - Create username and password
   - Set privileges to "Read and write to any database"
   - Save the password (you'll need it)

4. **Set Network Access:**
   - Go to **Network Access** → **Add IP Address**
   - Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - Or add Render's IP ranges (but allowing all is easier for testing)

5. **Update Connection String:**
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name (e.g., `electricityTracker`)
   - Final format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/electricityTracker?retryWrites=true&w=majority`

6. **Add to Render:**
   - Go to Render → Environment tab
   - Add variable:
     - Key: `MONGO_URI`
     - Value: Your connection string (from step 5)
   - **Important:** No quotes, no spaces
   - Click **Save Changes**

### Option B: Using Local MongoDB (Not Recommended for Production)

If you have MongoDB running locally:
```
mongodb://localhost:27017/electricityTracker
```

**Note:** This won't work on Render unless you have a MongoDB service running there.

## Step 3: Verify Connection String Format

**Correct formats:**
- MongoDB Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/database?retryWrites=true&w=majority`
- Local: `mongodb://localhost:27017/database`

**Common mistakes:**
- ❌ `"mongodb+srv://..."` (with quotes)
- ❌ `mongodb+srv://user:pass@cluster.mongodb.net/` (missing database name)
- ❌ `mongodb+srv://user:<password>@cluster.mongodb.net/` (with `<password>` placeholder)
- ✅ `mongodb+srv://user:actualpassword@cluster.mongodb.net/database`

## Step 4: Redeploy Backend

**After adding/updating MONGO_URI:**

1. Go to Render → **Manual Deploy**
2. Click **"Deploy latest commit"**
3. Wait for deployment to complete
4. Check **Logs** tab - you should see: `MongoDB connected`

## Step 5: Test Again

1. **Test health endpoint:**
   ```
   https://electricity-bill-tracker.onrender.com/api/health
   ```
   Should now show:
   ```json
   {
     "mongodb": {
       "status": "connected",
       "connected": true
     }
   }
   ```

2. **Test login:**
   - Go to your Netlify site
   - Try to login
   - Should work now!

## Step 6: Check Render Logs

If still not connected:

1. Go to Render → **Logs** tab
2. Look for error messages:
   - `MongoDB connection error: ...`
   - `MongooseServerSelectionError: ...`
   - `Authentication failed: ...`

3. **Common errors:**
   - **"Authentication failed"** → Wrong username/password in connection string
   - **"Server selection timed out"** → Network access not configured in MongoDB Atlas
   - **"Invalid connection string"** → Format is wrong

## Quick Checklist

- [ ] `MONGO_URI` is set in Render Environment tab
- [ ] Connection string format is correct (no quotes, has database name)
- [ ] Password in connection string is URL-encoded if it has special characters
- [ ] MongoDB Atlas network access allows `0.0.0.0/0` (or Render IPs)
- [ ] Database user exists in MongoDB Atlas
- [ ] Backend redeployed after adding/updating MONGO_URI
- [ ] Checked Render logs for "MongoDB connected" message
- [ ] Health check shows `connected: true`

## URL Encoding Special Characters

If your MongoDB password has special characters, encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `/` → `%2F`
- `:` → `%3A`
- `?` → `%3F`

Example:
- Password: `my@pass#123`
- Encoded: `my%40pass%23123`
- Connection string: `mongodb+srv://user:my%40pass%23123@cluster.mongodb.net/database`

## Still Not Working?

1. **Check Render logs** - They show the exact MongoDB error
2. **Test connection string locally** - Try connecting with MongoDB Compass or `mongosh`
3. **Verify MongoDB Atlas cluster is running** - Check cluster status in Atlas dashboard
4. **Check network access** - Make sure `0.0.0.0/0` is allowed in MongoDB Atlas

Once MongoDB is connected, all your login/signup requests will work!

