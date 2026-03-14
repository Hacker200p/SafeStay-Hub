# πŸ"Ί SafeStay Hub - Deployment Commands Quick Reference

**Print this page for quick reference during deployment** πŸ–¨οΈ

---

## 🚀 RAILWAY BACKEND DEPLOYMENT

### 1. Verify Backend Locally
```bash
cd backend
npm install
npm start
curl http://localhost:5000/api/health
```

### 2. Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output β†' Railway JWT_SECRET
```

### 3. Prepare Repository
```bash
cd ..
git status
git add .
git commit -m "deployment: prepare Railway and Vercel config"
git push origin main
```

### 4. Railway Environment Variables
```
Set in Railway Dashboard:

NODE_ENV                    = production
PORT                        = 5000
MONGO_URI                   = mongodb+srv://user:pass@cluster/db
JWT_SECRET                  = (generated above)
JWT_EXPIRE                  = 7d
FRONTEND_URL                = https://your-vercel-app.vercel.app
CLOUDINARY_CLOUD_NAME       = your_value
CLOUDINARY_API_KEY          = your_value
CLOUDINARY_API_SECRET       = your_value
RAZORPAY_KEY_ID             = rzp_live_...
RAZORPAY_KEY_SECRET         = your_value
TWILIO_ACCOUNT_SID          = ACxxxxxxxx
TWILIO_AUTH_TOKEN           = your_token
TWILIO_PHONE_NUMBER         = +1234567890
EMAIL_HOST                  = smtp.gmail.com
EMAIL_PORT                  = 587
EMAIL_USER                  = your_email@gmail.com
EMAIL_PASSWORD              = app_password
VITE_MAPBOX_TOKEN           = pk_...
RATE_LIMIT_ENABLED          = true
```

### 5. Deploy & Verify
```bash
# Railway auto-deploys on push
# Check Railway dashboard for status

# Get API URL from Railway dashboard
# Test:
curl https://your-api.up.railway.app/api/health

# Expected: {"success":true,...}
```

---

## 🌐 VERCEL FRONTEND DEPLOYMENT

### 1. Verify Frontend Locally
```bash
cd frontend
npm install
npm run build
ls -la dist/          # Should exist
npm run preview
```

### 2. Prepare & Push
```bash
cd ..
git status
git push origin main
```

### 3. Vercel Environment Variables
```
Set in Vercel Dashboard:

VITE_API_URL        = https://your-api.up.railway.app
VITE_MAPBOX_TOKEN   = pk_...
VITE_APP_NAME       = SafeStay Hub
VITE_APP_VERSION    = 1.0.0
```

### 4. Deploy & Verify
```bash
# Vercel auto-deploys on push
# Check Vercel dashboard for status

# Visit your frontend URL
# https://your-project.vercel.app

# Check browser:
# - No blank page
# - Maps display
# - API calls work (Network tab)
```

---

## βœ… VERIFICATION CHECKLIST

### Backend Tests
```bash
# Health check
curl https://your-api.up.railway.app/api/health
# Response: {"success":true}

# Connect to database
# Check Railway logs for: "MongoDB Connected"

# Test authentication
curl -X POST https://your-api.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123"}'
# Response: Should include JWT token
```

### Frontend Tests
```bash
# Open browser console
# Check no errors

# Test API connectivity
fetch(import.meta.env.VITE_API_URL + '/api/health')
  .then(r => r.json())
  .then(d => console.log('Connected:', d))

# Test Mapbox
# Maps should display on search page

# Test Socket.IO
# Console should show socket connection logs
```

---

## 🔧 QUICK TROUBLESHOOTING

### Backend won't start
```bash
# Check logs:
railway logs --service backend

# Check variables:
# - MONGO_URI correct?
# - All required env vars set?
# - JWT_SECRET is 32+ chars?
```

### Frontend blank page
```bash
# Check env vars in Vercel dashboard:
# - VITE_API_URL set?
# - Points to correct Railway URL?

# Check browser console for errors
# Must be HTTPS (not HTTP)
```

### CORS errors
```bash
# Railway backend needs:
FRONTEND_URL = https://your-vercel-app.vercel.app
# (exactly, including https:// and no trailing /)

# Vercel frontend needs:
VITE_API_URL = https://your-api.up.railway.app
# (exactly, including https:// and no trailing /)

# After updating, redeploy both
```

### Maps not showing
```bash
# Check Mapbox token in Vercel:
VITE_MAPBOX_TOKEN = pk_...

# Verify token is active at mapbox.com
```

---

## πŸ"ž Emergency Commands

### View logs in real-time
```bash
# Railway
railway logs --service backend --follow

# Or check Vercel dashboard > Deployments > Logs
```

### Rollback deployment
```bash
git revert <commit-hash>
git push origin main
# Auto-redeploys both platforms
```

### Force rebuild
```bash
# Railway: Dashboard > Services > backend > Review > Redeploy
# Vercel: Dashboard > Deployments > ... > Redeploy
```

### Check uptime
```bash
# Railway health
curl https://status.railway.app

# Vercel status
curl https://www.ojirhub.com/status/vercel

# MongoDB status
curl https://status.mongodb.com
```

---

## 🎯 Deployment Sequence

```
1. Local testing (15 min)
   cd backend && npm start           ← test backend
   cd ../frontend && npm run build   ← test frontend

2. Repository update (2 min)
   git push origin main

3. Backend deployment (10-15 min)
   Watch Railway dashboard
   Verify: /api/health returns 200

4. Frontend deployment (5-10 min)
   Watch Vercel dashboard
   Verify: Homepage loads

5. Integration testing (10 min)
   Test API calls
   Test real-time updates
   Test file uploads

6. Production monitoring (ongoing)
   Watch error rates
   Monitor response times
```

---

## πŸ"‹ Environment Variable Templates

### Backend (.env.production)
```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://[user]:[password]@[cluster].mongodb.net/safestay-hub
JWT_SECRET=[generated-32-char-string]
JWT_EXPIRE=7d
FRONTEND_URL=https://[your-vercel-domain].vercel.app
CLOUDINARY_CLOUD_NAME=[your-value]
CLOUDINARY_API_KEY=[your-value]
CLOUDINARY_API_SECRET=[your-value]
RAZORPAY_KEY_ID=rzp_live_[your-value]
RAZORPAY_KEY_SECRET=[your-value]
TWILIO_ACCOUNT_SID=AC[your-value]
TWILIO_AUTH_TOKEN=[your-value]
TWILIO_PHONE_NUMBER=+[your-number]
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=[your-email]
EMAIL_PASSWORD=[app-password]
VITE_MAPBOX_TOKEN=pk_[your-token]
RATE_LIMIT_ENABLED=true
```

### Frontend (.env.production)
```
VITE_API_URL=https://[your-api].up.railway.app
VITE_MAPBOX_TOKEN=pk_[your-token]
VITE_APP_NAME=SafeStay Hub
VITE_APP_VERSION=1.0.0
```

---

## πŸ"' Credential Generation

```bash
# JWT Secret (32 random characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Database URL format
mongodb+srv://username:password@cluster.mongodb.net/safestay-hub?retryWrites=true&w=majority

# Razorpay: https://dashboard.razorpay.com/settings/api-keys
# Twilio: https://console.twilio.com/account/keys-credentials/api-keys
# Cloudinary: https://cloudinary.com/console/settings/api-keys
# Mapbox: https://account.mapbox.com/tokens
```

---

## πŸŒ URLs Reference

### During Deployment
- Railway: https://railway.app/dashboard
- Vercel: https://vercel.com/dashboard
- MongoDB: https://cloud.mongodb.com
- Razorpay: https://dashboard.razorpay.com
- Twilio: https://console.twilio.com
- Cloudinary: https://cloudinary.com/console
- Mapbox: https://account.mapbox.com

### After Deployment
- API: https://[your-api].up.railway.app/api/health
- Frontend: https://[your-project].vercel.app
- Logs (Railway): https://railway.app/dashboard
- Logs (Vercel): https://vercel.com/dashboard

---

**Print & Keep Handy During Deployment**  
**Last Updated:** March 14, 2026
