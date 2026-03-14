# 🌐 SafeStay Hub - Vercel Frontend Deployment Guide

**Status:** Ready to Deploy  
**Platform:** Vercel  
**Estimated Time:** 20-30 minutes  
**Difficulty:** Beginner  

---

## πŸ"‹ Table of Contents
1. [Prerequisites](#prerequisites)
2. [Vercel Setup](#vercel-setup)
3. [Environment Configuration](#environment-configuration)
4. [Deployment Process](#deployment-process)
5. [Verification](#verification)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)
8. [Optimizations](#optimizations)

---

## βœ… Prerequisites

### 1. Have These Ready
- [ ] GitHub account with repository access
- [ ] Vercel account (https://vercel.com) - free tier is fine
- [ ] Railway backend deployed (get URL: https://your-api.up.railway.app)
- [ ] Mapbox token (https://mapbox.com)

### 2. Environment Requirements
- Frontend repository must be on GitHub/GitLab/Bitbucket
- Repository root or explicitly set `frontend` as root directory
- Node.js 18+ (Vercel handles this)

### 3. Verify Locally First
```bash
# In frontend directory:
npm install
npm run build    # Should create dist/ folder without errors
npm run preview  # Should run successfully on localhost

# Check that API URL can be configured:
cat frontend/.env.production.example
```

---

## 🏗️ Vercel Setup

### Step 1: Create Vercel Project

1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select `Safe Stay Hub` repository
4. Click **Import**

### Step 2: Configure Project Settings

In the "Configure Project" dialog:

**Framework Preset:** Select **Vite**

**Root Directory:** Click **Edit** and select **`frontend`**

**Build Command:** Keep default (vercel.json will override)

**Output Directory:** Keep default

**Install Command:** Keep default

Click **Deploy**

**This starts the deployment process!** βœ…

### Step 3: Add Environment Variables

**BEFORE** the deploy completes, add environment variables:

1. Click **Environment Variables** (during deploy wizard)
2. Add the following variables:

```
VITE_API_URL = https://your-railway-backend.up.railway.app
VITE_MAPBOX_TOKEN = your_mapbox_token_here
VITE_APP_NAME = SafeStay Hub
VITE_APP_VERSION = 1.0.0
```

3. Click **Deploy**

**Expected:** Vercel will build and deploy your frontend

### Vercel Project Settings (After Deploy)

1. Go to https://vercel.com/dashboard
2. Select **SafeStay Hub** project
3. Click **Settings** β†' **Environment Variables**

**Verify all variables are set:**
- [ ] VITE_API_URL
- [ ] VITE_MAPBOX_TOKEN
- [ ] VITE_APP_NAME
- [ ] VITE_APP_VERSION

---

## βš™οΈ Environment Configuration

### CRITICAL: API URL Configuration

**The frontend MUST know where your backend is!**

```
VITE_API_URL = https://your-railway-backend.up.railway.app
```

**NOT:**
- `http://...` (must be HTTPS)
- `http://localhost:5000` (only for local development)
- With trailing slash `/` (must not have trailing slash)

**To find your Railway backend URL:**
1. Go to https://railway.app/dashboard
2. Select your backend project
3. In the service panel, click the **URL** or find it in "Networking" tab
4. Copy the full URL (example: `https://safestay-api-prod.up.railway.app`)
5. Paste into Vercel as `VITE_API_URL`

### Configure Mapbox Token

1. Go to https://www.mapbox.com/account/signup/
2. Create account if needed
3. In dashboard, go to **Tokens**
4. Create new token with:
   - Name: `SafeStay Hub Frontend`
   - Permissions: Public token, default scopes
5. Copy token
6. Set in Vercel: `VITE_MAPBOX_TOKEN = pk_...`

---

## πŸš€ Deployment Process

### Automatic Deployment (Recommended)

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "feat: update feature"

# Push to GitHub
git push origin main

# Vercel automatically:
# 1. Detects push
# 2. Builds project
# 3. Runs tests (if configured)
# 4. Deploys to production
```

**Deployment Status:** Check Vercel dashboard for live progress

### Manual Deployment

1. Go to https://vercel.com/dashboard/projects
2. Select **SafeStay Hub**
3. Click **Deployments** at top
4. Click **...** on latest deployment
5. Select **Redeploy**

### Preview Deployments

Vercel automatically creates preview deployments for:
- Pull requests
- Branch pushes (not main)

**Use for testing before merging!**

### Deployment Timeline

```
Time    Event
────────────────────────────────────────
0:00    Push to GitHub
0:05    Vercel detects push
0:10    Build starts (npm install)
0:20    Build completes (vite build)
0:25    Tests run
0:30    Deploy to edge location
0:35    Live on production URL
```

---

## βœ… Verification

### Step 1: Check Deployment Status

1. Go to Vercel dashboard
2. Select **SafeStay Hub** project
3. Click **Deployments**
4. Latest deployment should show "Ready"

**If FAILED:**
- Click deployment name
- Click **Logs** tab
- Check error messages
- (See Troubleshooting section)

### Step 2: Test Production URL

```bash
# Get your Vercel production URL:
# Format: https://your-project-name.vercel.app
# Example: https://safestay-hub.vercel.app

# Visit in browser:
https://safestay-hub.vercel.app

# Should see SafeStay Hub homepage loaded
```

### Step 3: Verify Environment Variables

In browser console:
```javascript
// Check if API URL is set
console.log(import.meta.env.VITE_API_URL)
// Should output: https://your-railway-backend.up.railway.app

// Check if Mapbox token is set
console.log(import.meta.env.VITE_MAPBOX_TOKEN)
// Should output: pk_...
```

### Step 4: Test API Connectivity

```javascript
// In browser console:
const apiUrl = import.meta.env.VITE_API_URL;

// Test health endpoint:
fetch(`${apiUrl}/api/health`)
  .then(r => r.json())
  .then(d => console.log('Backend connected:', d))
  .catch(e => console.error('Backend error:', e));

// Should show: Backend connected: { success: true, ... }
```

### Step 5: Test Key Features

1. **Authentication:**
   - Go to Register page
   - Submit form
   - Should connect to Railway backend

2. **Maps:**
   - Verify maps load (Mapbox token working)
   - Pan and zoom

3. **Real-time Updates:**
   - Open browser console
   - Watch for Socket.IO connection
   - Should show "Socket connected" logs

4. **Image Upload:**
   - Try uploading hostel image
   - Should upload to Cloudinary via backend

---

## πŸ"Š Monitoring

### Vercel Dashboard Monitoring

1. **Deployments:**
   - View all deployments
   - Each shows duration and status
   - Click for detailed logs

2. **Analytics:**
   - Page speed metrics
   - Request counts
   - Geographic distribution

3. **Monitoring:**
   - Error tracking (with Sentry integration)
   - Real User Monitoring (RUM)
   - Performance metrics

### Performance Monitoring

```bash
# Check page load metrics
# In Vercel dashboard: Analytics tab
# Should see:
- First Contentful Paint (FCP): < 0.5 sec
- Largest Contentful Paint (LCP): < 2.5 sec
- Cumulative Layout Shift (CLS): < 0.1
```

### Error Monitoring

**Monitor these in Vercel dashboard:**
1. Build errors
2. Runtime errors
3. API errors
4. Image optimization errors

---

## 🐛 Troubleshooting

### Issue 1: Build Fails - "Cannot find module 'axios'"

**Symptoms:**
```
Build error: Cannot find module 'axios'
```

**Solution:**
```bash
# Verify dependencies locally:
npm install
npm run build    # Should work locally first

# Check package.json is committed:
git status package.json package-lock.json

# If files are modified:
git add package.json package-lock.json
git commit -m "fix: update dependencies"
git push origin main

# Trigger Vercel rebuild:
# In Vercel dashboard, click Deployments > ... > Redeploy
```

### Issue 2: Pages Show Blank / Nothing Loads

**Symptoms:**
```
Blank white page
No errors in browser console
```

**Solutions:**

**A) Check environment variables:**
```javascript
// In browser console:
console.log(import.meta.env)
// Should show VITE_API_URL and VITE_MAPBOX_TOKEN
```

**B) Check backend connectivity:**
```javascript
// In browser console:
fetch(import.meta.env.VITE_API_URL + '/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**C) Check build output:**
```bash
# Locally:
npm run build
# Check dist/ folder
# Should have index.html and js/css files
```

### Issue 3: CORS Errors - "Access blocked by CORS policy"

**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**

1. **Verify backend FRONTEND_URL is set correctly:**
   ```bash
   # In Railway dashboard Variables, check:
   FRONTEND_URL = https://your-vercel-app.vercel.app
   # (no trailing slash)
   ```

2. **Verify VITE_API_URL is set correctly in Vercel:**
   ```
   VITE_API_URL = https://your-railway-backend.up.railway.app
   # (no trailing slash)
   ```

3. **Redeploy both backend and frontend:**
   ```bash
   # Push to GitHub:
   git push origin main
   
   # Trigger Railway rebuild
   # Trigger Vercel rebuild
   ```

### Issue 4: Maps Not Showing / Mapbox Error

**Symptoms:**
```
White/gray map area
Mapbox GL error in console
```

**Solution:**

1. **Verify token:**
   ```bash
   # In Vercel dashboard:
   Settings > Environment Variables
   
   # Check VITE_MAPBOX_TOKEN looks like: pk_...
   ```

2. **Check token permissions:**
   - Go to https://mapbox.com/account/tokens
   - Select token
   - Verify it has required scopes

3. **Regenerate if needed:**
   ```bash
   # Create new token:
   1. Go to mapbox.com/account/tokens
   2. Create new token
   3. Update VITE_API_URL in frontend/.env.production.example
   4. Update VITE_MAPBOX_TOKEN in Vercel dashboard
   5. Redeploy
   ```

### Issue 5: Images Not Loading / Cloudinary Error

**Symptoms:**
```
Image upload fails
Network tab shows 401 error
```

**Solution:**

1. **Verify backend credentials in Railway:**
   ```bash
   CLOUDINARY_CLOUD_NAME = your_value
   CLOUDINARY_API_KEY = your_value
   CLOUDINARY_API_SECRET = your_value
   ```

2. **Test locally first:**
   ```bash
   # In backend directory:
   npm run dev
   # Try uploading image through frontend running on localhost
   ```

3. **Check Cloudinary account:**
   - Visit https://cloudinary.com/console
   - Check status of uploaded images

### Issue 6: Crashes on Specific Page

**Symptoms:**
```
App works then crashes when accessing certain page
500 error in browser console
```

**Solution:**

1. **Check browser console for errors**
   ```javascript
   // Note the exact error and line number
   ```

2. **Check Vercel logs:**
   ```bash
   # In Vercel dashboard:
   Deployments > [deployment-name] > Logs
   ```

3. **Test locally:**
   ```bash
   npm run dev
   # Try to reproduce the crash locally
   # Fix locally first
   ```

4. **Commit and push:**
   ```bash
   git commit -m "fix: crash on [page-name]"
   git push origin main
   # Vercel auto-deploys
   ```

---

## βš' Optimizations

### Already Optimized in Your Project

1. βœ… **Code Splitting:** React Router lazy loading
2. βœ… **Minification:** Vite production build
3. βœ… **Tree Shaking:** ES6 modules
4. βœ… **Compression:** Vercel gzip automatically
5. βœ… **Image Optimization:** Cloudinary handles this

### Further Optimizations (Optional)

1. **Enable Vercel Analytics:**
   ```bash
   # In Vercel dashboard:
   Settings > Analytics
   Enable "Web Analytics"
   ```

2. **Add Sentry Error Tracking:**
   ```bash
   # Install Sentry:
   npm install --save @sentry/react
   
   # Configure in frontend code
   # Set SENTRY_DSN in Vercel
   ```

3. **Optimize Images:**
   - Use WebP format
   - Compress before upload
   - Serve via Cloudinary CDN

4. **Caching Strategy:**
   ```bash
   # Let Vercel cache responses via
   # vercel.json cache-control headers
   ```

---

## 🌍 Custom Domain (Optional)

### Add Custom Domain

1. Go to Vercel project settings
2. Click **Domains**
3. Enter your domain (e.g., `app.safestay.com`)
4. Vercel provides DNS records to add

**Alternative:** Use Vercel's free subdomain and share `https://safestay-hub.vercel.app`

---

## πŸ" Deployment Checklist

- [ ] Frontend repository connected to Vercel
- [ ] Root directory set to `frontend`
- [ ] Build command verified (`npm run build`)
- [ ] Output directory verified (`dist`)
- [ ] Environment variables set:
  - [ ] VITE_API_URL (Railway URL)
  - [ ] VITE_MAPBOX_TOKEN
  - [ ] VITE_APP_NAME
  - [ ] VITE_APP_VERSION
- [ ] Build completes successfully
- [ ] Homepage loads without errors
- [ ] API connectivity verified
- [ ] Maps load correctly
- [ ] Authentication works
- [ ] File uploads work
- [ ] Real-time updates work
- [ ] Performance metrics acceptable
- [ ] No console errors
- [ ] Monitored for 1-2 hours after deploy

---

## πŸ" Additional Resources

- Vercel Docs: https://vercel.com/docs
- Vite Deployment: https://vitejs.dev/guide/build.html
- Environment Variables: https://vercel.com/docs/environment-variables
- Analytics: https://vercel.com/analytics

---

**Last Updated:** March 14, 2026  
**Estimated Deployment Time:** 20-30 minutes  
**Difficulty:** Beginner  
**Status:** Ready to Deploy
