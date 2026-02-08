# 🎯 START HERE - Complete Setup Guide

## What You Need to Do (In Order)

### STEP 0: Download Everything ⬇️

**Right now, you need to:**

1. **Download ALL the files** from Claude (me) to your computer
2. Create a folder like: `C:\Projects\fieldflow-crm\` (Windows) or `~/Projects/fieldflow-crm/` (Mac)
3. Save these folders inside:
   - `FieldServiceCRM/` (backend)
   - `frontend/` (frontend)
   - All `.md` guide files
   - All scripts (`.sh`, `.bat`)

**Your folder structure should look like:**
```
fieldflow-crm/
├── FieldServiceCRM/
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   └── ... (all backend files)
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ... (all frontend files)
├── README.md
├── EASIEST_DEPLOYMENT.md
├── setup.sh
└── ... (all other guides)
```

---

## OPTION A: Test Locally First (Recommended)

### STEP 1: Install Prerequisites

**Check if you have these installed:**

```bash
# Open terminal/command prompt and run:
dotnet --version   # Should show 8.x or higher
node --version     # Should show v18.x or higher
npm --version      # Should show 9.x or higher
```

**If any are missing:**
- .NET: https://dotnet.microsoft.com/download
- Node.js: https://nodejs.org/ (get LTS version)

### STEP 2: Test Locally

```bash
# Open terminal in your fieldflow-crm folder
cd C:\Projects\fieldflow-crm\    # Windows
# or
cd ~/Projects/fieldflow-crm/     # Mac/Linux

# Run the setup script
./setup.sh          # Mac/Linux
setup.bat           # Windows (double-click or run in cmd)
```

**This will:**
- Install all dependencies
- Create the database
- Set everything up

**Then start the app:**

**Terminal 1 - Backend:**
```bash
cd FieldServiceCRM
dotnet run
```
(Leave this running - should say "listening on port 5000")

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
(Leave this running - should say "Local: http://localhost:3000")

**Test:** Open http://localhost:3000 in your browser

✅ **If it works locally, you're ready to deploy!**

---

## OPTION B: Deploy Directly to Internet (Skip Local Testing)

### STEP 1: Push to GitHub

```bash
# In your fieldflow-crm folder
git init
git add .
git commit -m "Initial commit - FieldFlow CRM"

# Go to GitHub.com, create a new repository (don't initialize it)
# Then run (replace YOUR_USERNAME):
git remote add origin https://github.com/YOUR_USERNAME/fieldflow-crm.git
git branch -M main
git push -u origin main
```

✅ **Your code is now on GitHub!**

### STEP 2: Deploy Backend to Railway

1. Go to: https://railway.app
2. Sign up with your GitHub account
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `fieldflow-crm` repository
6. Railway will detect .NET and deploy automatically

**Wait 2-3 minutes...**

7. Copy your Railway URL (looks like: `https://fieldflow-crm-production.up.railway.app`)
8. Test it: Open `https://your-url.railway.app/swagger`

✅ **Backend is live!**

### STEP 3: Update Frontend Config

**On your computer, edit these files:**

**File 1:** `frontend/src/App.jsx` (around line 8):
```javascript
// Change from:
const API_BASE = 'http://localhost:5000/api';

// To (use YOUR Railway URL):
const API_BASE = 'https://your-url.railway.app/api';
```

**File 2:** `FieldServiceCRM/Program.cs` (around line 19):
```csharp
// Add your GitHub username:
policy.WithOrigins(
    "http://localhost:3000",
    "https://YOUR_USERNAME.github.io"  // Replace YOUR_USERNAME
)
```

**Save both files, then:**
```bash
git add .
git commit -m "Update for production deployment"
git push
```

(Railway will automatically redeploy in 2 minutes!)

### STEP 4: Deploy Frontend to GitHub Pages

```bash
cd frontend

# Make sure dependencies are installed
npm install

# Deploy to GitHub Pages
npm run deploy
```

**Enable GitHub Pages:**
1. Go to: https://github.com/YOUR_USERNAME/fieldflow-crm/settings/pages
2. Under "Source", select: `gh-pages` branch
3. Click "Save"

**Wait about 1 minute...**

✅ **Frontend is live at:** `https://YOUR_USERNAME.github.io/fieldflow-crm/`

---

## 🎉 YOU'RE DONE!

Your app is now on the internet!

**Your URLs:**
- **Frontend:** `https://YOUR_USERNAME.github.io/fieldflow-crm/`
- **Backend API:** `https://your-url.railway.app/`
- **API Docs:** `https://your-url.railway.app/swagger`

**Share the frontend URL with anyone!**

---

## 📋 Summary of What Happens Where

| Task | Where It Happens |
|------|-----------------|
| **Download files** | You do this - download from Claude to your computer |
| **Edit files** | On your computer (with any text editor) |
| **Run local setup** | On your computer (in terminal) |
| **Push to GitHub** | You do this from your computer |
| **Deploy backend** | Railway website (railway.app) - connects to GitHub |
| **Deploy frontend** | You run `npm run deploy` from your computer |
| **Enable GitHub Pages** | GitHub website (in repo settings) |

---

## 🆘 Which Guide Should I Read?

**If you want to test locally first:**
→ Read **QUICKSTART.md** or **DIAGNOSTIC_GUIDE.md**

**If you want to deploy to internet immediately:**
→ Read **EASIEST_DEPLOYMENT.md** (Railway + GitHub Pages)

**If you're having issues:**
→ Read **TROUBLESHOOTING.md**

**If you want all the details:**
→ Read **README.md**

---

## 🎯 Quick Decision Tree

```
Do you have .NET and Node.js installed?
├─ YES → Use setup.sh/bat, test locally first
└─ NO  → Install them first, or skip to deployment

Want to test before going live?
├─ YES → Test locally (setup.sh/bat → dotnet run → npm run dev)
└─ NO  → Deploy directly (push to GitHub → Railway → GitHub Pages)

Having issues?
├─ Can't run locally → Read DIAGNOSTIC_GUIDE.md
├─ Deployment issues → Read EASIEST_DEPLOYMENT.md troubleshooting
└─ Other issues → Read TROUBLESHOOTING.md
```

---

## ⚡ Fastest Path to Live App

**If you just want it on the internet ASAP (15 minutes):**

1. ✅ Download files to your computer
2. ✅ Push to GitHub (`git init`, `git add .`, `git commit`, `git push`)
3. ✅ Deploy backend (railway.app - click, click, done)
4. ✅ Update API_BASE in App.jsx
5. ✅ Push again (`git push`)
6. ✅ Deploy frontend (`npm run deploy`)
7. ✅ Enable GitHub Pages in settings

**Done!** Your app is live.

---

## 💡 Remember

- **I (Claude) can't access your computer or GitHub account**
- **You need to download the files first**
- **Then you run commands from your computer**
- **Deployment happens via websites (Railway, GitHub)**

---

## 🚀 You Got This!

Everything is ready - just download, follow EASIEST_DEPLOYMENT.md, and you'll be live!

The hardest part is downloading the files. Everything after that is copy-paste commands! 💪
