# 🎉 Deploy ENTIRE App to GitHub Pages (100% Free!)

## Overview

GitHub Pages can host your **frontend for free**. For the backend, we'll use **Railway.app** or **Render.com** (both have free tiers that work with .NET).

This is the **EASIEST** free deployment option!

---

## Option A: Frontend on GitHub Pages + Backend on Railway (Recommended)

### Step 1: Push Code to GitHub (2 minutes)

```bash
# In your project root folder
git init
git add .
git commit -m "Initial commit - FieldFlow CRM"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/fieldflow-crm.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend to Railway.app (5 minutes)

**Railway.app** offers $5/month free credit and supports .NET!

1. Go to https://railway.app
2. Sign up with GitHub (free)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `fieldflow-crm` repository
5. Railway will detect it's a .NET app
6. Click "Deploy"

**Configure:**
- Go to Settings → Add these:
  - Root Directory: `FieldServiceCRM`
  - Start Command: `dotnet FieldServiceCRM.dll`

**Get your URL:**
- Railway gives you: `https://your-app.railway.app`
- Test: `https://your-app.railway.app/swagger`

### Step 3: Deploy Frontend to GitHub Pages (5 minutes)

**Update API URL in frontend:**

Edit `frontend/src/App.jsx`:
```javascript
// Change from:
const API_BASE = 'http://localhost:5000/api';

// To your Railway URL:
const API_BASE = 'https://your-app.railway.app/api';
```

**Update CORS in backend:**

Edit `FieldServiceCRM/Program.cs`:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "https://YOUR_USERNAME.github.io"  // Add your GitHub Pages URL
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});
```

Commit and push this change - Railway will auto-deploy!

**Build and Deploy Frontend:**

```bash
cd frontend

# Build for production
npm run build

# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json (add this line in "scripts" section):
# "deploy": "gh-pages -d dist"

# Deploy!
npm run deploy
```

**Enable GitHub Pages:**
1. Go to your GitHub repo
2. Settings → Pages
3. Source: `gh-pages` branch
4. Save

Your app will be live at:
`https://YOUR_USERNAME.github.io/fieldflow-crm/`

---

## Option B: 100% GitHub Pages (Frontend Only with Mock Data)

If you just want to test the UI without a backend:

### Step 1: Create Demo Mode

Update `frontend/src/App.jsx` to use mock data:

```javascript
// At the top of App.jsx, add:
const DEMO_MODE = true;

// Update the api object:
const api = {
  customers: {
    getAll: () => DEMO_MODE ? 
      Promise.resolve([
        { id: 1, name: 'Demo Customer', email: 'demo@example.com', phone: '555-0100', address: '123 Demo St', contactPerson: 'John Demo', jobCount: 5, totalRevenue: 15000, isActive: true, createdDate: new Date() }
      ]) : 
      fetch(`${API_BASE}/customers`).then(r => r.json()),
    // ... similar for other methods
  },
  // ... other entities
};
```

### Step 2: Deploy to GitHub Pages

```bash
cd frontend

# Update package.json, add:
# "homepage": "https://YOUR_USERNAME.github.io/fieldflow-crm"

npm run build
npm install --save-dev gh-pages

# Add to package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

npm run deploy
```

**Enable GitHub Pages:**
- Repo → Settings → Pages
- Source: `gh-pages` branch

Live at: `https://YOUR_USERNAME.github.io/fieldflow-crm/`

---

## Option C: Both on Render.com (Free Tier)

**Render.com** can host both frontend and backend for free!

### Deploy Backend:

1. Go to https://render.com
2. Sign up with GitHub
3. New → Web Service
4. Connect your repo
5. Settings:
   - Name: `fieldflow-api`
   - Root Directory: `FieldServiceCRM`
   - Build Command: `dotnet publish -c Release -o out`
   - Start Command: `dotnet out/FieldServiceCRM.dll`

Get URL: `https://fieldflow-api.onrender.com`

### Deploy Frontend:

1. Render.com → New → Static Site
2. Connect your repo
3. Settings:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

Get URL: `https://fieldflow-crm.onrender.com`

---

## Full GitHub Pages Setup Script

Let me create an automated script for you:

```bash
#!/bin/bash

echo "Deploying to GitHub Pages..."

# Update API URL
echo "Enter your backend URL (e.g., https://your-app.railway.app):"
read BACKEND_URL

# Update App.jsx
sed -i "s|http://localhost:5000/api|${BACKEND_URL}/api|g" frontend/src/App.jsx

# Update package.json for GitHub Pages
cd frontend

# Add homepage if not exists
if ! grep -q "homepage" package.json; then
  sed -i '2i\  "homepage": "https://YOUR_USERNAME.github.io/fieldflow-crm",' package.json
fi

# Add deploy scripts if not exists
if ! grep -q "gh-pages" package.json; then
  npm install --save-dev gh-pages
  # Add scripts
fi

# Build and deploy
npm run build
npm run deploy

echo "✅ Deployed to GitHub Pages!"
echo "Enable it at: https://github.com/YOUR_USERNAME/fieldflow-crm/settings/pages"
```

---

## Comparison of Free Options

| Option | Frontend | Backend | Setup Time | Best For |
|--------|----------|---------|------------|----------|
| **GitHub Pages + Railway** | GitHub Pages | Railway.app | 10 min | Production-ready |
| **GitHub Pages + Render** | GitHub Pages | Render.com | 10 min | Production-ready |
| **GitHub Pages Only** | GitHub Pages | Mock data | 5 min | UI testing |
| **Render (both)** | Render | Render | 15 min | All-in-one |
| **Netlify + Railway** | Netlify | Railway | 10 min | Alternative |

---

## Step-by-Step: Railway + GitHub Pages (EASIEST)

### Part 1: Backend on Railway

```bash
# 1. Push to GitHub (if not done)
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/fieldflow-crm.git
git push -u origin main

# 2. Go to railway.app
# 3. Sign up with GitHub
# 4. New Project → Deploy from GitHub
# 5. Select your repo
# 6. Railway auto-detects .NET
# 7. Add environment variables if needed:
#    - ASPNETCORE_ENVIRONMENT=Production
# 8. Deploy!

# Get your URL: https://your-app.railway.app
```

### Part 2: Update Frontend Config

```bash
# Edit frontend/src/App.jsx
# Line ~8: Change API_BASE to:
const API_BASE = 'https://your-app.railway.app/api';

# Edit frontend/package.json, add after "name":
"homepage": "https://YOUR_USERNAME.github.io/fieldflow-crm",
```

### Part 3: Update Backend CORS

```bash
# Edit FieldServiceCRM/Program.cs
# Update CORS policy to include:
policy.WithOrigins(
    "http://localhost:3000",
    "https://YOUR_USERNAME.github.io"  // Add this
)
```

Commit and push - Railway auto-deploys!

### Part 4: Deploy Frontend

```bash
cd frontend

# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json "scripts":
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

# Deploy!
npm run deploy

# Enable on GitHub:
# Repo → Settings → Pages → Source: gh-pages branch
```

**Done!** Your app is live at:
- **Frontend:** `https://YOUR_USERNAME.github.io/fieldflow-crm/`
- **Backend:** `https://your-app.railway.app/`

---

## Testing Your Deployment

### Test Backend:
```bash
curl https://your-app.railway.app/api/customers
# Should return JSON
```

Visit: `https://your-app.railway.app/swagger`

### Test Frontend:
Visit: `https://YOUR_USERNAME.github.io/fieldflow-crm/`
- Should load the app
- Check browser console for errors
- Try creating a customer

---

## Troubleshooting

### Railway Issues:

**Build fails:**
- Check Railway logs in dashboard
- Verify .NET version is 8.0

**App crashes:**
- Check deployment logs
- Verify start command is correct
- Database permissions issue? Railway should handle SQLite

### GitHub Pages Issues:

**404 errors:**
- Make sure `homepage` in package.json is correct
- Use `HashRouter` instead of `BrowserRouter` if needed

**CORS errors:**
- Update backend CORS with GitHub Pages URL
- Redeploy backend

**Blank page:**
- Check browser console
- Verify API_BASE URL is correct
- Check if backend is running

---

## GitHub Pages with HashRouter (If routing issues)

If you have routing problems with GitHub Pages, use HashRouter:

Edit `frontend/src/main.jsx`:
```javascript
import { HashRouter } from 'react-router-dom'; // If you add routing later

// Currently you don't have routing, so you're good!
```

---

## Free Tier Limits

### Railway.app:
- $5 free credit/month
- ~500 hours of runtime
- Perfect for demos/testing

### Render.com:
- Unlimited free static sites
- 750 hours/month for web services
- Sleeps after 15 min inactivity

### GitHub Pages:
- Unlimited for public repos
- 100GB bandwidth/month
- 1GB storage

---

## Pro Tips

1. **Deploy backend first, test it, THEN deploy frontend**
2. **Always update CORS when you get your URLs**
3. **Railway/Render auto-deploy on git push (amazing!)**
4. **GitHub Pages needs manual deploy (npm run deploy)**
5. **Check browser console for frontend errors**
6. **Check Railway/Render logs for backend errors**

---

## Quick Commands Reference

**Deploy Backend (Railway):**
- Push to GitHub
- Railway auto-deploys

**Deploy Frontend (GitHub Pages):**
```bash
cd frontend
npm run deploy
```

**Update and Redeploy:**
```bash
git add .
git commit -m "Updates"
git push  # Backend redeploys automatically

cd frontend
npm run deploy  # Frontend needs manual deploy
```

---

## 🎉 You'll Have:

- ✅ **Backend** live on Railway (free)
- ✅ **Frontend** live on GitHub Pages (free)  
- ✅ **Public URL** to share with anyone
- ✅ **Auto-deploy** on git push (backend)
- ✅ **No credit card** required

**Total cost: $0.00/month** 💰

**Setup time: ~15 minutes** ⏱️

This is the BEST way to test your app on the internet for free!
