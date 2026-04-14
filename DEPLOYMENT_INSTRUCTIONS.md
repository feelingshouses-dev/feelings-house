# 🚀 DEPLOYMENT GUIDE - Feelings Houses Santorini

## LIVE DEPLOYMENT TODAY! 🎯

---

## 📋 QUICK START (45 minutes total)

### PART 1: GitHub Setup (5 minutes - ALREADY DONE!)
✅ Repository created  
✅ Code uploaded  
✅ Ready to deploy

### PART 2: Vercel Deployment (15 minutes)

**Step 1: Import Project**
1. Go to: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import"** next to the repository
4. Framework Preset: **"Create React App"**
5. Root Directory: `frontend`
6. Build Command: `yarn build`
7. Output Directory: `build`

**Step 2: Environment Variables**
Click **"Environment Variables"** and add:
```
Key: REACT_APP_BACKEND_URL
Value: (Will add after backend deployment - Step 3)
```

**Step 3: Deploy**
- Click **"Deploy"**
- Wait 3-5 minutes
- Copy your Vercel URL: `https://your-app.vercel.app`

---

### PART 3: Render Backend Deployment (20 minutes)

**Step 1: Create Web Service**
1. Go to: https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Name: `feelings-houses-backend`
5. Root Directory: `backend`
6. Environment: **Python 3**
7. Build Command: `pip install -r requirements.txt`
8. Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

**Step 2: Environment Variables**
Add these:
```
MONGO_URL=mongodb+srv://feelings_admin:6932659816Del@feelingshouses.jgubn0g.mongodb.net/feelings_houses?appName=FeelingsHouses

DB_NAME=feelings_houses

CORS_ORIGINS=*
```

**Step 3: Deploy**
- Click **"Create Web Service"**
- Wait 5-10 minutes for build
- Copy your Render URL: `https://feelings-houses-backend.onrender.com`

**Step 4: Update Frontend**
1. Go back to Vercel Dashboard
2. Project Settings → Environment Variables
3. Update `REACT_APP_BACKEND_URL` with your Render URL
4. Redeploy frontend

---

### PART 4: Domain Setup (10 minutes)

**Vercel Side:**
1. Vercel Dashboard → Your Project → Settings → Domains
2. Add domain: `feelingshouses.gr`
3. Copy the DNS records shown

**Hostinger Side:**
1. Hostinger Dashboard → Domains → Manage
2. DNS / Name Servers → DNS Zone
3. Add CNAME record:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   TTL: 3600
   ```
4. Add A record:
   ```
   Type: A
   Name: www
   Value: 76.76.21.21
   TTL: 3600
   ```

**Wait:** 5-60 minutes for DNS propagation

---

## ✅ VERIFICATION

After deployment, test:

1. **Frontend:** https://your-app.vercel.app
   - Should show homepage with logo

2. **Backend:** https://your-backend.onrender.com/api/
   - Should return: `{"message": "Hello World"}`

3. **Admin Panel:** https://your-app.vercel.app/admin/calendar-sync
   - Should show 4 properties with calendars

4. **Custom Domain:** https://feelingshouses.gr
   - Should work after DNS propagation

---

## 🆘 TROUBLESHOOTING

### Frontend white screen:
- Check browser console (F12)
- Verify `REACT_APP_BACKEND_URL` is correct
- Redeploy after fixing

### Backend 500 error:
- Check Render logs
- Verify MongoDB connection string
- Check environment variables

### CORS errors:
- Verify `CORS_ORIGINS=*` in backend
- Redeploy backend

---

## 💰 COSTS

**Current (Free Tier):**
- Vercel: €0/month
- Render: €0/month (with sleep)
- MongoDB: €0/month (512MB)
- **TOTAL: €0/month**

**Production (Always-On):**
- Vercel: €0/month (still free!)
- Render: €7/month (no sleep)
- MongoDB: €0/month
- **TOTAL: €7/month**

---

## 📞 SUPPORT

If you get stuck, check:
1. Vercel logs: Dashboard → Deployments → View Logs
2. Render logs: Dashboard → Logs
3. Browser console: F12 → Console

---

**LIVE SITE IN 45 MINUTES!** 🎉
