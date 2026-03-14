# πŸ"' SafeStay Hub - Secrets & Credentials Management Guide

**CRITICAL:** Complete this before any deployment  
**Key Focus:** Rotate ALL credentials, never reuse development keys

---

## 🚨 SECURITY CRITICAL ITEMS

### Current State (INSECURE)
```
backend/.env contains EXPOSED credentials:
βœ— Cloudinary API credentials visible
βœ— Razorpay test keys visible
βœ— Twilio tokens visible
βœ— MongoDB connection string visible
βœ— Mapbox token visible
βœ— JWT_SECRET is weak/generic
```

### After Deployment (SECURE)
```
βœ" All production credentials are UNIQUE
βœ" .env files are NEVER committed to git
βœ" Credentials managed via platform dashboards only
βœ" Rotation schedule established
βœ" Audit trail maintained
```

---

## 1️⃣ RAZORPAY - Payment Processing

### Step 1: Create/Rotate Keys
```
1. Go to: https://dashboard.razorpay.com/settings/api-keys
2. Current keys shown with created date and last used date
3. Click "GENERATE NEW KEY" button
4. New Key ID and Key Secret will be displayed
5. Copy BOTH values before closing (can't be recovered)
```

### Step 2: Store Securely

**For Railway:**
```
1. Go to Railway dashboard
2. Find your backend project
3. Click Variables
4. Add/Update:
   RAZORPAY_KEY_ID = rzp_live_... (copied above)
   RAZORPAY_KEY_SECRET = ... (copied above)
5. Save and redeploy
```

**For Local Development Testing:**
```bash
# Create backend/.env with:
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

# NEVER add to git, git ignores it
```

### Step 3: Test
```bash
# Try a test payment
# Expected: Payment processing works
# Check: https://dashboard.razorpay.com/transactions?tab=payments shows your test
```

### Step 4: Deactivate Old Keys
```
1. Return to: https://dashboard.razorpay.com/settings/api-keys
2. Find old keys
3. Click "Disable" button to deactivate
4. Confirm: Old key is no longer active
```

---

## 2️⃣ TWILIO - SMS & OTP Service

### Step 1: Generate New API Key
```
1. Go to: https://console.twilio.com/account/keys-credentials/api-keys
2. Click "Create API Key" (if you had old ones)
3. Give it a friendly name: "SafeStay Production"
4. Click "Create API Key"
5. Copy the KEY SID and AUTH TOKEN
6. Store safely (you can't view them again)
```

### Step 2: Store in Railway

**For Railway:**
```
1. Rail dashboard > Variables
2. Add:
   TWILIO_ACCOUNT_SID = ACxxxxxxxx... (from console)
   TWILIO_AUTH_TOKEN = auth_token_value (from console)
   TWILIO_PHONE_NUMBER = +1234567890 (your Twilio number)
3. Save and redeploy
```

### Step 3: Verify Phone Number

```
1. Go to: https://console.twilio.com/account/phone-numbers/verified
2. Verify your phone number appears (needed for SMS)
3. Or add a new phone number to send SMS from
```

### Step 4: Test
```bash
# Trigger OTP registration
# Check phone - you should receive SMS
```

---

## 3️⃣ CLOUDINARY - Image Upload & Hosting

### Step 1: Generate New API Key
```
1. Go to: https://cloudinary.com/console/settings/api-keys
2. View existing keys (created date, consumption)
3. If needed, generate new key:
   - Click "Generate" next to API KEY section
   - Confirm which keys to regenerate
4. Copy: CLOUD NAME, API KEY, API SECRET
```

### Step 2: Store in Platforms

**For Railway (backend uses these):**
```
Cloudinary dashboard > Variables
CLOUDINARY_CLOUD_NAME = dyz... (your account name)
CLOUDINARY_API_KEY = 578674... (numeric)
CLOUDINARY_API_SECRET = RdwS65... (alphanumeric)
```

**For Frontend (passes to backend):**
```
Frontend .env doesn't need these
(Backend handles image uploads)
```

### Step 3: Test Image Upload
```bash
# Try uploading hostel image from app
# Should appear in: https://cloudinary.com/console/media_library
```

---

## 4️⃣ MAPBOX - Maps Integration

### Step 1: Create New Token
```
1. Go to: https://account.mapbox.com/tokens
2. Click "Create a token"
3. Name it: "SafeStay Hub Production"
4. Scopes: Leave as default (all read scopes)
5. URLs: Add your Vercel domain
   - Example: https://safestay-hub.vercel.app
6. Create token
7. Copy the token (starts with pk_)
```

### Step 2: Store in Platforms

**For Frontend (displays maps):**
```
Vercel dashboard > Environment Variables
VITE_MAPBOX_TOKEN = pk_eyJ... (token from above)
Redeploy frontend
```

**For Backend (serves token):**
```
Railway Variables (if using token endpoint)
VITE_MAPBOX_TOKEN = pk_eyJ...
```

### Step 3: Test Maps
```
Visit your app and check:
1. Maps display on hostel search
2. Pan and zoom works
3. Markers appear correctly
No Mapbox errors in browser console
```

---

## 5️⃣ JSON WEB TOKEN (JWT) - Authentication

### Step 1: Generate Strong Secret

```bash
# On your development machine, run ONCE:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output example:
# a7f3c9e1b2d4f6a8c0e2b4d6f8a0c2e4

# COPY THIS VALUE
```

### Step 2: Store in Railway

```
Railway Variables:
JWT_SECRET = a7f3c9e1b2d4f6a8c0e2b4d6f8a0c2e4
JWT_EXPIRE = 7d

Save and redeploy
```

### Step 3: Verify

```bash
# Only need to verify once
# If JWT tokens not being generated, check logs
curl -X POST https://your-api.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Testpass123"}'

# Should return JWT token in response
```

---

## 6️⃣ MONGODB - Database Connection

### Step 1: Set Up Atlas Cluster

```
1. Go to: https://cloud.mongodb.com
2. Create cluster if not exists
3. Click "CONNECT" button
4. Get connection string:
   mongodb+srv://username:password@cluster.mongodb.net/safestay-hub
5. Copy the full string
```

### Step 2: IP Whitelist

```
CRITICAL for Railway access:

1. In MongoDB, go to Network Access
2. Click "+ ADD IP ADDRESS"
3. Option A: Add Railway IP (more secure)
   - Check Railway service logs for the IP
   - Add that specific IP
4. Option B: Allow anywhere (easier for testing)
   - Select "Allow access from anywhere"
5. Confirm
```

### Step 3: Store in Railway

```
Railway Variables:
MONGO_URI = mongodb+srv://user:password@cluster.mongodb.net/safestay-hub?retryWrites=true&w=majority

Note: URL must include:
- Username
- Password
- Cluster name
- Database name (safestay-hub)
- Retry parameters
```

### Step 4: Test

```bash
# In Railway logs, should see:
"MongoDB Connected: cluster0-shard-00-00.abc.mongodb.net"

# If fails:
1. Check MONGO_URI format
2. Check IP whitelist
3. Check credentials
4. Check database user has permissions
```

---

## 7️⃣ EMAIL - Notifications (Optional)

### Step 1: Set Up Gmail App Password

```
If using Gmail:

1. Enable 2FA on Google Account
   https://myaccount.google.com/security
   
2. Generate App Password
   https://myaccount.google.com/apppasswords
   
3. Select "Mail" and "Windows Computer"
4. Copy the 16-character password
5. This is your EMAIL_PASSWORD
```

### Step 2: Store in Railway

```
Railway Variables:
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_USER = your-email@gmail.com
EMAIL_PASSWORD = xxxx xxxx xxxx xxxx (16 chars with spaces)
```

### Step 3: Test

```bash
# Try triggering an email flow
# Check your email inbox
# Verify email arrives from your email
```

---

## πŸ"‹ DEPLOYMENT CREDENTIALS CHECKLIST

### Before Deployment

- [ ] **Razorpay**
  - [ ] New Key ID generated
  - [ ] New Key Secret generated
  - [ ] Old keys disabled
  - [ ] New keys saved to Railway
  - [ ] Payment flow tested

- [ ] **Twilio**
  - [ ] New API Key created
  - [ ] Key SID copied
  - [ ] Auth Token copied
  - [ ] Phone number verified
  - [ ] SMS received in test

- [ ] **Cloudinary**
  - [ ] New API Key generated (or existing)
  - [ ] Cloud Name noted
  - [ ] API Key noted
  - [ ] API Secret noted
  - [ ] Saved to Railway

- [ ] **Mapbox**
  - [ ] New token created
  - [ ] Token name set
  - [ ] URLs restricted to production domain
  - [ ] Token saved to Vercel
  - [ ] Maps display in app

- [ ] **JWT Secret**
  - [ ] 32+ character random string generated
  - [ ] Saved to Railway
  - [ ] Authentication working

- [ ] **MongoDB**
  - [ ] Connection string correct
  - [ ] IP whitelist updated for Railway
  - [ ] Username/password correct
  - [ ] Connection tested

- [ ] **Email**
  - [ ] Gmail app password generated (if using)
  - [ ] Saved to Railway
  - [ ] Email sending tested (optional)

---

## πŸ"" ROTATION SCHEDULE (Production)

### Quarterly (Every 3 months)
- [ ] Rotate JWT_SECRET
- [ ] Rotate Razorpay keys (if possible)
- [ ] Rotate Cloudinary API keys
- [ ] Rotate Mapbox tokens

### Semi-Annual (Every 6 months)
- [ ] Rotate Twilio API keys
- [ ] Review MongoDB user password
- [ ] Audit all active tokens

### As Needed
- [ ] If key is suspected compromised
- [ ] If team member leaves
- [ ] If security incident detected

---

## 🚨 EMERGENCY: Suspected Compromise

If you suspect any credential is compromised:

### Immediate Actions (within 1 hour)
1. **Rotate the key immediately**
   - Generate new key on the service
   - Update Railway/Vercel variables
   - Redeploy application

2. **Disable old key**
   - If possible, disable in service settings

3. **Check logs for abuse**
   - Razorpay: https://dashboard.razorpay.com/transactions
   - MongoDB: Check active connections
   - Twilio: check sent messages log

### Within 24 hours
- Review incident
- Update security documentation
- Notify team members if needed
- Plan improvements to prevent future incidents

---

## πŸ"' GIT SECURITY

### Ensure Secrets Are Never Committed

```bash
# Verify .env is ignored:
git check-ignore backend/.env
# Should output: backend/.env

# If doesn't output anything, add to .gitignore:
echo "*.env" >> .gitignore
echo ".env.local" >> .gitignore

# Verify it worked:
git check-ignore backend/.env
# Should now output: backend/.env

# Check nothing secret was already committed:
git log -p --all -S "RAZORPAY_KEY" -- "*.js" "*.json" "*.md"
# Should return nothing (no commits with this key)

# Commit .gitignore update:
git add .gitignore
git commit -m "security: ensure secrets ignored"
```

---

## ✨ Production Ready Checklist

- [ ] All credentials regenerated with UNIQUE values
- [ ] .env files confirmed in .gitignore
- [ ] Railway environment variables set correctly
- [ ] Vercel environment variables set correctly
- [ ] No credentials visible in code/commits
- [ ] MongoDB IP whitelist updated
- [ ] All services tested with new credentials
- [ ] Backup of old credentials (if needed for rollback)
- [ ] Team notified of new credentials

---

## πŸ"ˆ Monitoring Credentials Health

After deployment, monitor these:

```bash
# Monthly checks:
1. MongoDB Atlas dashboard - check active connections
2. Razorpay dashboard - verify transaction volume normal
3. Cloudinary - check upload usage normal
4. Vercel/Railway - no unusual error patterns
```

**If anything looks abnormal:**
- Immediately rotate affected credentials
- Check logs for unauthorized access
- Notify team members
- File incident report

---

**Last Updated:** March 14, 2026  
**Status:** Ready for credential setup  
**Next Step:** Execute credential generation and storage per instructions above
