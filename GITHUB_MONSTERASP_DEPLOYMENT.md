# GitHub & MonsterASP Deployment Guide

## Part 1: Push to GitHub

### Step 1: Create GitHub Repository

1. Go to https://github.com
2. Click the "+" icon → "New repository"
3. Name it: `fieldflow-crm` (or your preferred name)
4. Keep it **Public** or **Private** (your choice)
5. Do **NOT** initialize with README (we already have files)
6. Click "Create repository"

### Step 2: Push Your Code to GitHub

Open terminal in the root folder (where FieldServiceCRM and frontend folders are) and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - FieldFlow CRM"

# Add your GitHub repository as remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/fieldflow-crm.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/johnsmith/fieldflow-crm.git
```

### Step 3: Verify on GitHub

Go to your GitHub repository URL and you should see all your files!

---

## Part 2: Deploy Backend to MonsterASP

MonsterASP free tier supports .NET hosting. Here's how to deploy:

### Option A: Deploy via FTP (Easiest for MonsterASP Free)

**1. Build Your Backend for Production**

```bash
cd FieldServiceCRM
dotnet publish -c Release -o ./publish
```

This creates a `publish` folder with all needed files.

**2. Get MonsterASP FTP Credentials**

- Log into your MonsterASP account
- Go to your hosting control panel
- Find FTP credentials (usually in "FTP Accounts" or "File Manager")
- Note: hostname, username, password

**3. Upload Files via FTP**

Use an FTP client like FileZilla:
- Download FileZilla: https://filezilla-project.org/
- Connect using your MonsterASP FTP credentials
- Upload everything from the `publish` folder to your web root (usually `httpdocs` or `wwwroot`)

**Important files to upload:**
- All .dll files
- appsettings.json
- appsettings.Production.json
- web.config (create if needed - see below)
- All other files from publish folder

**4. Create web.config**

Create this file in your web root:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <location path="." inheritInChildApplications="false">
    <system.webServer>
      <handlers>
        <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
      </handlers>
      <aspNetCore processPath="dotnet" 
                  arguments=".\FieldServiceCRM.dll" 
                  stdoutLogEnabled="false" 
                  stdoutLogFile=".\logs\stdout" 
                  hostingModel="inprocess" />
    </system.webServer>
  </location>
</configuration>
```

**5. Database Setup**

The SQLite database will be created automatically on first run. Make sure the web server has write permissions to the folder.

**6. Update CORS for Your Domain**

In `Program.cs`, update CORS to include your MonsterASP domain:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000", 
            "http://localhost:5173",
            "https://yourdomain.monsterasp.com",  // Add your domain
            "https://yourdomain.com"  // If you have custom domain
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});
```

---

## Part 3: Deploy Frontend

### Option A: Deploy to Netlify (Free, Easiest)

**1. Build Frontend**

```bash
cd frontend
npm install
npm run build
```

This creates a `dist` folder.

**2. Deploy to Netlify**

- Go to https://netlify.com
- Sign up/log in (can use GitHub)
- Drag and drop the `dist` folder to Netlify
- Get your live URL (e.g., `https://your-app.netlify.app`)

**3. Update API URL**

Before building, update `frontend/src/App.jsx`:

```javascript
// Change this line:
const API_BASE = 'http://localhost:5000/api';

// To your MonsterASP backend URL:
const API_BASE = 'https://yourdomain.monsterasp.com/api';
```

Then rebuild and redeploy.

### Option B: Deploy Frontend to MonsterASP (if they support static files)

**1. Build Frontend**

```bash
cd frontend
npm run build
```

**2. Upload dist folder**

- Use FTP to upload contents of `dist` folder
- Put in a subfolder like `client` or directly in web root

**3. Configure URL**

Update the API_BASE in App.jsx to point to your backend.

### Option C: Deploy to Vercel (Alternative Free Option)

```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

Follow prompts, and you'll get a live URL.

---

## Part 4: Connect Frontend to Backend

### Update Environment Variables

**In frontend/src/App.jsx**, change:

```javascript
// Development
const API_BASE = 'http://localhost:5000/api';

// Production (update before building)
const API_BASE = 'https://your-backend.monsterasp.com/api';
```

**Better approach - use environment variables:**

Create `frontend/.env.production`:
```
VITE_API_URL=https://your-backend.monsterasp.com/api
```

Update `App.jsx`:
```javascript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

---

## Complete Deployment Workflow

### Initial Setup

```bash
# 1. Clone from GitHub (on your local machine)
git clone https://github.com/YOUR_USERNAME/fieldflow-crm.git
cd fieldflow-crm

# 2. Setup Backend
cd FieldServiceCRM
dotnet restore
dotnet ef migrations add InitialCreate
dotnet ef database update

# 3. Build Backend for Production
dotnet publish -c Release -o ./publish

# 4. Setup Frontend
cd ../frontend
npm install

# 5. Update API URL in App.jsx to your MonsterASP domain

# 6. Build Frontend
npm run build

# 7. Upload Backend (publish folder) to MonsterASP via FTP

# 8. Upload Frontend (dist folder) to Netlify or MonsterASP
```

---

## MonsterASP Specific Notes

### Free Tier Limitations

MonsterASP free tier typically includes:
- Limited storage (check their specs)
- Shared hosting
- Basic .NET support
- FTP access
- No SSH access usually

### Requirements

Make sure MonsterASP supports:
- .NET 8.0 or higher
- Write permissions for SQLite database

### Troubleshooting MonsterASP

**If backend doesn't work:**
1. Check MonsterASP control panel logs
2. Verify .NET version is supported
3. Check file permissions
4. Ensure web.config is correct
5. Contact MonsterASP support

**Common issues:**
- Missing AspNetCore module
- Incorrect file permissions
- .NET version mismatch

---

## Alternative Free Hosting Options

If MonsterASP doesn't work well:

### Backend Alternatives:
1. **Railway.app** - Free tier, supports .NET
2. **Render.com** - Free tier, easy .NET deployment
3. **Azure App Service** - Free tier available
4. **Heroku** - With .NET buildpack

### Frontend Alternatives:
1. **Netlify** - Best for React apps
2. **Vercel** - Great for static sites
3. **GitHub Pages** - Free, but requires some config
4. **Cloudflare Pages** - Fast and free

---

## Testing Your Deployment

Once deployed:

1. **Test Backend:**
   - Visit: `https://your-domain.monsterasp.com/swagger`
   - Should see API documentation

2. **Test Frontend:**
   - Visit: `https://your-app.netlify.app`
   - Should load the app
   - Check browser console for errors

3. **Test Connection:**
   - Click around in the app
   - Try creating a customer
   - Check if data saves

---

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Backend built (`dotnet publish`)
- [ ] Backend uploaded to MonsterASP
- [ ] web.config created
- [ ] CORS updated with production domain
- [ ] Frontend API_BASE updated
- [ ] Frontend built (`npm run build`)
- [ ] Frontend deployed (Netlify/Vercel)
- [ ] Tested backend at /swagger
- [ ] Tested frontend loads
- [ ] Tested creating/editing data

---

## Need Help?

Common deployment issues:
1. CORS errors → Update Program.cs CORS policy
2. API not found → Check API_BASE URL
3. Database errors → Verify write permissions
4. 500 errors → Check MonsterASP logs

For specific MonsterASP issues, contact their support with:
- Your .NET version
- Error messages from logs
- Screenshots of issues
