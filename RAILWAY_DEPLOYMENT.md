# πŸš€ SafeStay Hub - Railway Backend Deployment Guide

**Status:** Ready to Deploy  
**Platform:** Railway  
**Estimated Time:** 30-45 minutes  
**Difficulty:** Intermediate  

---

## πŸ"‹ Table of Contents
1. [Prerequisites](#prerequisites)
2. [Railway Setup](#railway-setup)
3. [Environment Configuration](#environment-configuration)
4. [Deployment Process](#deployment-process)
5. [Verification](#verification)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)
8. [Scaling](#scaling)

---

## βœ… Prerequisites

### 1. Have These Ready
- [ ] GitHub account with repository access
- [ ] Railway account (https://railway.app)
- [ ] MongoDB Atlas account (https://cloud.mongodb.com)
- [ ] All third-party API keys:
  - Razorpay credentials
  - Twilio credentials
  - Cloudinary credentials
  - Mapbox token

### 2. Repository Setup
```bash
# Ensure .env is NOT in git
git check-ignore backend/.env           # Should return: backend/.env
git check-ignore backend/.env.local     # Should return: backend/.env.local

# Commit essential files
git add backend/railway.json backend/Procfile backend/.env.production.example
git commit -m "chore: add Railway deployment configuration"
git push origin main
```

---

## πŸ› Railway Setup

### Step 1: Create Railway Project

1. Go to https://railway.app/dashboard/projects
2. Click **New Project**
3. Click **Deploy from GitHub repo**
4. Select your repository
5. Select `backend` directory as the root directory
6. Click **Deploy**

**Expected:** Railway will start building your project

### Step 2: Configure Environment Variables

1. In Railway dashboard, go to **Variables**
2. Add all environment variables from `.env.production.example`:

```
NODE_ENV                    = production
PORT                        = 5000
MONGO_URI                   = mongodb+srv://user:pass@cluster.mongodb.net/safestay-hub
JWT_SECRET                  = [GENERATE STRONG STRING - min 32 chars]
FRONTEND_URL                = https://your-vercel-app.vercel.app
CLOUDINARY_CLOUD_NAME       = your_value
CLOUDINARY_API_KEY          = your_value
CLOUDINARY_API_SECRET       = your_value
RAZORPAY_KEY_ID             = your_value
RAZORPAY_KEY_SECRET         = your_value
TWILIO_ACCOUNT_SID          = your_value
TWILIO_AUTH_TOKEN           = your_value
TWILIO_PHONE_NUMBER         = +1234567890
EMAIL_HOST                  = smtp.gmail.com
EMAIL_PORT                  = 587
EMAIL_USER                  = your_email@gmail.com
EMAIL_PASSWORD              = your_app_password
VITE_MAPBOX_TOKEN           = your_value
RATE_LIMIT_ENABLED          = true
RATE_LIMIT_MAX              = 600
RATE_LIMIT_WINDOW_MS        = 900000
```

### Step 3: Configure MongoDB Access

**Important:** Allow Railway IP to access MongoDB

1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Select your cluster
3. Go to **Network Access** β†' **IP Whitelist**
4. Click **+ Add IP Address**
5. Click **Allow from anywhere** (or add specific Railway IP)
   - Better: Get Railway IP from logs and add specific IP
6. Click **Confirm**

**Test connection:**
```bash
npm run dev      # Should connect to MongoDB
```

---

## βš™οΈ Environment Configuration

### Generate JWT_SECRET

```bash
# On your local machine, run:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Example output:
# a7f3c9e1b2d4f6a8c0e2b4d6f8a0c2e4

# Copy this and set in Railway as JWT_SECRET
```

### Verify Environment Variable Format

```bash
# Test locally first:
cp backend/.env.production.example backend/.env.production
# Then edit .env.production with actual values
npm run dev

# Check health endpoint works:
curl http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "success": true,
  "message": "SafeStay Hub API is running",
  "timestamp": "2026-03-14T10:30:00.000Z",
  "uptime": 120,
  "environment": "development",
  "health": { "cpu": 25, "memory": 180 }
}
```

---

## πŸš€ Deployment Process

### Option A: Automatic Deployment (Recommended)

1. **Enable auto-deployments** in Railway:
   - Dashboard β†' Settings
   - Enable "Deploy on push"
   - Select `main` branch

2. **Push code to GitHub:**
   ```bash
   git push origin main
   ```

3. **Railway auto-deploys** βœ…

### Option B: Manual Deployment

1. **In Railway Dashboard:**
   - Select your project
   - Click **Services**
   - Click your Node.js service
   - Click **Deploy** button
   - Select commit/branch to deploy

### Deployment Timeline

```
Time    Event
────────────────────────────────────────
0:00    Push to GitHub
0:05    Railway detects push
0:10    Build starts (npm install)
0:20    Build completes
0:25    Deployment starts
0:30    Service online & listening
```

---

## βœ… Verification

### Step 1: Check Deployment Status

```bash
# In Railway dashboard, check:
1. Build status should be completed (green checkmark)
2. Service should show "Running" status
3. No error messages in logs
```

### Step 2: Test Health Endpoint

```bash
# Get Railway URL from dashboard
# It looks like: https://safestay-api-production.up.railway.app

# Test health check:
curl https://safestay-api-production.up.railway.app/api/health

# Expected response (JSON):
{
  "success": true,
  "message": "SafeStay Hub API is running",
  "environment": "production"
}
```

### Step 3: Test Database Connection

```bash
# In Railway logs, you should see:
"MongoDB Connected: cluster0-shard-00-00.abc.mongodb.net"

# If not, check:
1. MONGO_URI is correct
2. MongoDB IP whitelist allows Railway
3. Database user has correct permissions
```

### Step 4: Test Real-time Socket.IO

```javascript
// Test in browser console:
const socket = io('https://safestay-api-production.up.railway.app');
socket.on('connect', () => console.log('Connected!'));
socket.on('connect_error', (error) => console.error(error));

// Should see "Connected!" without errors
```

### Step 5: Test API Endpoints

```bash
# Test a public endpoint:
curl https://safestay-api-production.up.railway.app/api/hostels/search

# Test authentication (register new user):
curl -X POST https://safestay-api-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "role": "tenant"
  }'
```

---

## πŸ"Š Monitoring

### Railway Dashboard Monitoring

1. **Logs:** Real-time application logs
   - Look for errors
   - Check connection messages
   - Monitor rate limiting

2. **Metrics:**
   - CPU usage (should be <30% under normal load)
   - Memory usage (should be <250MB)
   - Network I/O
   - Request count

3. **Alerts:** Set up notifications for:
   - Build failures
   - Deployment failures
   - High memory usage
   - High error rate

### Terminal Monitoring

```bash
# Follow logs in real-time:
railway logs --service backend

# Watch metrics:
railway status --service backend

# List all deployments:
railway logs --history
```

### Health Check Monitoring

```bash
# Set up continuous health checks:
watch -n 30 "curl -s https://safestay-api-production.up.railway.app/api/health | jq '.health'"

# Should show consistent CPU and memory usage
```

---

## 🐛 Troubleshooting

### Issue 1: Build Fails with "npm install error"

**Symptoms:**
```
error: npm ERR! code E404
error: npm ERR! 404 Not Found
```

**Solution:**
```bash
# Check package.json syntax:
npm install --dry-run

# Update dependencies:
npm update

# Commit and push:
git add package-lock.json
git commit -m "fix: update dependencies for Railway"
git push origin main

# Trigger Railway rebuild
```

### Issue 2: MongoDB Connection Fails

**Symptoms:**
```
ERROR: MONGO_URI is not set or is invalid
```

**Solution:**
1. Verify `MONGO_URI` in Railway Variables
2. Check MongoDB IP whitelist includes Railway IP
3. Test connection string locally:
   ```bash
   mongosh "mongodb+srv://user:pass@cluster.mongodb.net/safestay-hub"
   ```

### Issue 3: CORS Errors from Frontend

**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
```bash
# Verify FRONTEND_URL in Railway Variables:
# Should be: https://your-vercel-app.vercel.app

# Not: http://... (must be https in production)
# Not: with trailing slash: https://app.vercel.app/

# Redeploy after updating:
# In Railway, click Services > backend > Redeploy latest
```

### Issue 4: Out of Memory Error

**Symptoms:**
```
error: JavaScript heap out of memory
```

**Solution:**
1. In Railway, increase memory allocation:
   - Settings β†' Resources β†' Select higher plan
2. Or optimize code:
   - Enable compression: βœ… (already enabled)
   - Reduce query result sizes
   - Implement pagination

### Issue 5: Rate Limiting Too Strict

**Symptoms:**
```
429 Too many requests error
```

**Solution:**
```bash
# Adjust in Railway Variables:
RATE_LIMIT_MAX=1000          # Increase from 600 to 1000
RATE_LIMIT_WINDOW_MS=1800000 # Increase window to 30 minutes

# Or disable for testing:
RATE_LIMIT_ENABLED=false
```

### Issue 6: Panorama Service Not Starting

**Symptoms:**
```
Worker process failed to start
```

**Solution:**
```bash
# The Python panorama service runs separately
# For Railway, you may need to:
1. Create a separate service for Python
2. Or host panorama service on different platform
3. For now, panorama features may run on development only

# Check that main Node.js service starts without it:
npm start  # Should work even if panorama.py not running
```

---

## πŸ"ˆ Scaling

### As You Grow

#### Stage 1: Single Instance (Current)
- 1 CPU, 0.5GB RAM
- Handles ~100 concurrent users
- Monitor CPU and memory

#### Stage 2: Multiple Instances
```bash
# In Railway dashboard:
1. Services β†' backend
2. Settings β†' Replica Count = 2
3. This creates load-balanced deployment
```

#### Stage 3: Database Optimization
```bash
# Enable MongoDB indexes:
npm run setup:db-indexes

# Enable read replicas
# Enable connection pooling
# Monitor slow queries
```

#### Stage 4: Caching Layer
```bash
# Add Redis for caching:
1. In Railway, add Redis service
2. Update code to use Redis
3. Cache frequently accessed data
```

---

## πŸŒ Deployment Checklist

- [ ] All environment variables set in Railway
- [ ] MongoDB IP whitelist updated
- [ ] JWT_SECRET is strong (32+ chars)
- [ ] FRONTEND_URL set correctly
- [ ] All API keys rotated (Razorpay, Twilio, Cloudinary)
- [ ] Build completes successfully
- [ ] Health endpoint returns 200
- [ ] Database connection succeeds
- [ ] Socket.IO connects without CORS errors
- [ ] Test endpoints working
- [ ] Monitoring set up
- [ ] Vercel frontend configured to point to Railway URL
- [ ] End-to-end testing complete

---

## πŸ" Additional Resources

- Railway Docs: https://docs.railway.app
- Node.js on Railway: https://docs.railway.app/guides/nodejs
- Environment Variables: https://docs.railway.app/develop/variables
- Monitoring: https://docs.railway.app/develop/monitoring

---

**Last Updated:** March 14, 2026  
**Estimated Deployment Time:** 30-45 minutes  
**Difficulty:** Intermediate  
**Status:** Ready to Deploy
