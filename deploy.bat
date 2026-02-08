@echo off
echo ================================
echo FieldFlow CRM - Quick Deploy
echo ================================
echo.

REM Check if git is initialized
if not exist .git (
    echo Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit - FieldFlow CRM"
    echo.
    echo [✓] Git initialized
    echo.
    echo Next steps:
    echo 1. Create a repository on GitHub
    echo 2. Run: git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
    echo 3. Run: git push -u origin main
    echo.
)

REM Build Backend
echo Building Backend...
cd FieldServiceCRM

REM Restore and build
dotnet restore
dotnet ef migrations add InitialCreate 2>nul
dotnet ef database update
dotnet publish -c Release -o ./publish

echo [✓] Backend built in FieldServiceCRM/publish/
echo.

cd ..

REM Build Frontend
echo Building Frontend...
cd frontend

REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

REM Build
call npm run build

echo [✓] Frontend built in frontend/dist/
echo.

cd ..

echo ================================
echo Build Complete!
echo ================================
echo.
echo Deployment files ready:
echo   Backend:  FieldServiceCRM/publish/
echo   Frontend: frontend/dist/
echo.
echo Next steps:
echo.
echo 1. PUSH TO GITHUB:
echo    git add .
echo    git commit -m "Ready for deployment"
echo    git push
echo.
echo 2. DEPLOY BACKEND (MonsterASP):
echo    - Upload FieldServiceCRM/publish/* via FTP
echo    - Ensure web.config is uploaded
echo.
echo 3. DEPLOY FRONTEND (Netlify/Vercel):
echo    - Drag/drop frontend/dist/ folder to Netlify
echo    - OR run: cd frontend ^&^& npx vercel
echo.
echo 4. UPDATE API URL:
echo    - Edit frontend/src/App.jsx
echo    - Change API_BASE to your backend URL
echo    - Rebuild: npm run build
echo    - Redeploy frontend
echo.
echo See GITHUB_MONSTERASP_DEPLOYMENT.md for detailed instructions!
echo ================================
pause
