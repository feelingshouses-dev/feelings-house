# ⚡ QUICK DEPLOYMENT CHECKLIST

## ✅ VERCEL (Frontend) - 15 mins

1. [ ] Go to https://vercel.com/dashboard
2. [ ] New Project → Import from GitHub
3. [ ] Select repository → Root: `frontend`
4. [ ] Framework: Create React App
5. [ ] Add ENV: `REACT_APP_BACKEND_URL` (empty for now)
6. [ ] Deploy
7. [ ] Copy Vercel URL

## ✅ RENDER (Backend) - 20 mins

1. [ ] Go to https://dashboard.render.com
2. [ ] New Web Service → Connect GitHub
3. [ ] Root: `backend`, Language: Python
4. [ ] Build: `pip install -r requirements.txt`
5. [ ] Start: `uvicorn server:app --host 0.0.0.0 --port $PORT`
6. [ ] Add 3 ENV variables:
   - MONGO_URL
   - DB_NAME=feelings_houses
   - CORS_ORIGINS=*
7. [ ] Deploy
8. [ ] Copy Render URL

## ✅ CONNECT (5 mins)

1. [ ] Update Vercel ENV: `REACT_APP_BACKEND_URL` = Render URL
2. [ ] Redeploy Vercel

## ✅ DOMAIN (10 mins)

1. [ ] Vercel: Add domain `feelingshouses.gr`
2. [ ] Hostinger: Add DNS records from Vercel
3. [ ] Wait 10-60 mins

## ✅ TEST

- [ ] Frontend loads
- [ ] Backend API works
- [ ] Admin panel shows calendars
- [ ] Domain resolves

**DONE!** 🎉
