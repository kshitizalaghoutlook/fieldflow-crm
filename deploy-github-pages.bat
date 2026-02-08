@echo off
echo ========================================
echo GitHub Pages Deployment Setup
echo ========================================
echo.

REM Check if git is initialized
if not exist .git (
    echo [X] Git not initialized!
    echo First, push your code to GitHub:
    echo.
    echo   git init
    echo   git add .
    echo   git commit -m "Initial commit"
    echo   git remote add origin https://github.com/YOUR_USERNAME/fieldflow-crm.git
    echo   git push -u origin main
    echo.
    pause
    exit /b 1
)

echo [✓] Git repository found
echo.

REM Get GitHub username and repo
set /p GITHUB_USER="Enter your GitHub username: "
set /p REPO_NAME="Enter your repository name (e.g., fieldflow-crm): "
echo.
set /p BACKEND_URL="Enter your backend URL (from Railway/Render): "

REM Validate backend URL
if "%BACKEND_URL%"=="" (
    echo [!] No backend URL provided. Using localhost (won't work on GitHub Pages^)
    set BACKEND_URL=http://localhost:5000
)

echo.
echo Configuration:
echo   GitHub User: %GITHUB_USER%
echo   Repository: %REPO_NAME%
echo   Backend URL: %BACKEND_URL%
echo   GitHub Pages URL: https://%GITHUB_USER%.github.io/%REPO_NAME%/
echo.
set /p CONFIRM="Is this correct? (y/n): "

if not "%CONFIRM%"=="y" (
    echo Aborted.
    pause
    exit /b 0
)

echo.
echo Step 1: Updating frontend configuration...

cd frontend

REM Update package.json homepage
powershell -Command "(gc package.json) -replace 'YOUR_USERNAME.github.io/fieldflow-crm', '%GITHUB_USER%.github.io/%REPO_NAME%' | Out-File -encoding ASCII package.json"

REM Update vite.config.js base
powershell -Command "(gc vite.config.js) -replace \"base: '/fieldflow-crm/',\", \"base: '/%REPO_NAME%/',\" | Out-File -encoding ASCII vite.config.js"

REM Update API_BASE in App.jsx
powershell -Command "(gc src/App.jsx) -replace \"const API_BASE = 'http://localhost:5000/api';\", \"const API_BASE = '%BACKEND_URL%/api';\" | Out-File -encoding ASCII src/App.jsx"

echo [✓] Frontend configuration updated
echo.

echo Step 2: Installing dependencies...
call npm install
call npm install --save-dev gh-pages

echo [✓] Dependencies installed
echo.

echo Step 3: Building frontend...
call npm run build

echo [✓] Frontend built
echo.

echo Step 4: Deploying to GitHub Pages...
call npm run deploy

echo.
echo ========================================
echo [✓] Deployment Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Go to: https://github.com/%GITHUB_USER%/%REPO_NAME%/settings/pages
echo 2. Under 'Source', select: gh-pages branch
echo 3. Click 'Save'
echo.
echo Your app will be live at:
echo   https://%GITHUB_USER%.github.io/%REPO_NAME%/
echo.
echo [!] IMPORTANT: Update your backend CORS!
echo In FieldServiceCRM/Program.cs, add:
echo   policy.WithOrigins(
echo     "https://%GITHUB_USER%.github.io"
echo   ^)
echo.
echo Then commit, push, and your backend will auto-redeploy.
echo ========================================
pause
