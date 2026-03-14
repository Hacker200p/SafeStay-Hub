# ⚑ SafeStay Hub - Pre-Deployment Quick Guide

**Complete this before deploying to Railway & Vercel**  
**Estimated Time:** 15 minutes  
**Status:** Follow exactly as listed  

---

## βœ… STEP 1: Security Audit (5 minutes)

### 1.1 Secure Your Credentials

```bash
# CRITICAL: Regenerate ALL API keys with fresh ones

# 1. Razorpay - Go to https://dashboard.razorpay.com/settings/api-keys
# - Generate new KEY ID
# - Generate new KEY SECRET
# - Copy these values

# 2. Twilio - Go to https://console.twilio.com/account/keys-credentials/api-keys/create
# - Create new API Key
# - Copy KEY SID and AUTH TOKEN

# 3. Cloudinary - Go to https://cloudinary.com/console/settings/api-keys
# - Reset API KEY
# - Reset API SECRET
# - Copy CLOUD NAME, API KEY, API SECRET

# 4. Mapbox - Go to https://account.mapbox.com/tokens
# - Create new token named "SafeStay Production"
# - Copy the token (starts with pk_)

# 5. JWT Secret - Generate strong random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy the output - this will be JWT_SECRET

# 6. Email - If using Gmail:
# Enable 2-Factor Authentication: https://myaccount.google.com/security
# Generate App Password: https://myaccount.google.com/apppasswords
# Copy the 16-character password
```

### 1.2 Verify .gitignore

```bash
# Check that .env files are ignored:
git check-ignore backend/.env                  # MUST return: backend/.env
git check-ignore backend/.env.local            # MUST return: backend/.env.local
git check-ignore frontend/.env                 # MUST return: frontend/.env
git check-ignore frontend/.env.local           # MUST return: frontend/.env.local

# If any returns nothing, add to .gitignore:
echo "*.env" >> .gitignore
echo ".env.local" >> .gitignore
git add .gitignore
git commit -m "security: ensure .env files ignored"
git push origin main
```

### 1.3 Verify No Secrets in Code

```bash
# Search for hardcoded secrets:
git grep -i "password\|secret\|key\|token" -- ** ":(exclude)*.md"

# Should return nothing related to actual credentials
# Only template comments like "your_key_here"
```

---

## βœ… STEP 2: Backend Verification (3 minutes)

```bash
# Navigate to backend:
cd backend

# 1. Install dependencies:
npm install

# 2. Test build:
npm run build 2>/dev/null || echo "No build script - OK"

# 3. Verify server starts:
npm start &           # Start in background
sleep 5
curl http://localhost:5000/api/health
kill %1               # Stop background process

# Expected response:
# {"success":true,"message":"SafeStay Hub API is running",...}

# 4. Return to root:
cd ..
```

---

## βœ… STEP 3: Frontend Verification (3 minutes)

```bash
# Navigate to frontend:
cd frontend

# 1. Install dependencies:
npm install

# 2. Build for production:
npm run build

# Expected: "dist/" folder created with index.html

# 3. Verify build output:
ls -la dist/

# Should see:
# - index.html
# - assets/ folder
# - No errors in output

# 4. Return to root:
cd ..
```

---

## βœ… STEP 4: Repository Ready (2 minutes)

```bash
# Ensure everything is committed:
git status          # Should show "nothing to commit, working tree clean"

# If not clean, commit:
git add .
git status
git commit -m "deployment: prepare for production"

# Push to GitHub:
git push origin main
```

---

## βœ… STEP 5: Verify Git Remote

```bash
# Confirm GitHub remote is set:
git remote -v

# Should show something like:
# origin  https://github.com/yourusername/Safe-Stay-Hub.git (fetch)
# origin  https://github.com/yourusername/Safe-Stay-Hub.git (push)
```

---

## πŸš€ DEPLOYMENT CHECKLISTS

### BEFORE Railway Deployment

- [ ] All new API keys generated (Razorpay, Twilio, Cloudinary, Mapbox)
- [ ] JWT_SECRET randomized (32+ chars)
- [ ] .env files NOT in git (verified with git check-ignore)
- [ ] backend/.env.production.example updated with YOUR values
- [ ] MongoDB Atlas cluster created and accessible
- [ ] MongoDB connection string works locally
- [ ] `npm install` completes without errors
- [ ] Server starts and /api/health endpoint returns 200
- [ ] GitHub repository is up to date
- [ ] Railway account created (railway.app)

### BEFORE Vercel Deployment

- [ ] All build errors fixed locally (`npm run build` succeeds)
- [ ] dist/ folder contains valid HTML
- [ ] Vite build completes successfully
- [ ] frontend/.env.production.example has correct values
- [ ] Mapbox token is valid
- [ ] GitHub repository is up to date
- [ ] Vercel account created (vercel.com)
- [ ] Railway backend URL obtained from Railway dashboard

---

## πŸ" Final Checklist - DO NOT DEPLOY UNTIL COMPLETE

```
SECURITY:
[ ] All credentials regenerated
[ ] JWT_SECRET is 32+ random characters
[ ] .env files confirmed not in .gitignore
[ ] No hardcoded secrets found
[ ] MongoDB password not exposed

BACKEND:
[ ] npm install succeeds
[ ] Server starts locally
[ ] /api/health endpoint works
[ ] No console errors
[ ] database.js connects without errors

FRONTEND:
[ ] npm install succeeds
[ ] npm run build succeeds
[ ] dist/index.html exists
[ ] No build errors
[ ] No eslint errors

REPOSITORY:
[ ] All files committed
[ ] Git status is clean
[ ] Latest code pushed to main
[ ] .env files confirmed ignored

ACCOUNTS:
[ ] Railway account created and logged in
[ ] Vercel account created and logged in
[ ] GitHub connected to both Railway and Vercel
[ ] All API keys copied to secure location

INFRASTRUCTURE:
[ ] MongoDB Atlas cluster running
[ ] IP whitelist configured (or will be)
[ ] Backup of current database created
```

---

## πŸ"‹ Quick Command Reference

```bash
# Security
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Backend
cd backend && npm install && npm start

# Frontend
cd frontend && npm install && npm run build

# Git
git status
git add .
git commit -m "message"
git push origin main

# Verify
curl http://localhost:5000/api/health
npm run build      # Frontend

# Check ignores
git check-ignore backend/.env
git check-ignore frontend/.env
```

---

## πŸ"Œ Important URLs

**During Setup:**
- Railway Signup: https://railway.app/register
- Vercel Signup: https://vercel.com/signup
- MongoDB Atlas: https://cloud.mongodb.com
- Razorpay Dashboard: https://dashboard.razorpay.com
- Twilio Console: https://console.twilio.com
- Cloudinary Dashboard: https://cloudinary.com/console
- Mapbox Account: https://account.mapbox.com

**After Deployment:**
- Railway Dashboard: https://railway.app/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- Your Backend API: `https://your-app.up.railway.app`
- Your Frontend: `https://your-project.vercel.app`

---

## ⏭️ NEXT STEPS

1. **Verify all checks:** Complete the checklist above
2. **Secure credentials:** Generate new API keys
3. **Deploy Backend:** Follow [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)
4. **Deploy Frontend:** Follow [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
5. **Verify Deployment:** Run end-to-end tests
6. **Monitor:** Watch logs for first 1-2 hours

---

**Status:** Ready to proceed with deployment  
**Last Updated:** March 14, 2026  
**Next:** Choose backend or frontend to deploy first (recommend backend first)
