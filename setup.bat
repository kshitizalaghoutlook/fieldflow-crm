@echo off
echo ============================== 
echo FieldFlow CRM Setup Script
echo ==============================
echo.

echo Checking prerequisites...

REM Check .NET
dotnet --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] .NET SDK not found. Please install .NET 8.0 or higher.
    pause
    exit /b 1
)
echo [✓] .NET SDK found

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Node.js not found. Please install Node.js 18 or higher.
    pause
    exit /b 1
)
echo [✓] Node.js found

echo.
echo Setting up Backend...
cd FieldServiceCRM

REM Restore .NET packages
echo Restoring .NET packages...
dotnet restore

REM Create database migration
echo Creating database migration...
dotnet ef migrations add InitialCreate

REM Update database
echo Updating database...
dotnet ef database update

echo [✓] Backend setup complete!
echo.

REM Setup Frontend
echo Setting up Frontend...
cd ..\frontend

REM Install npm packages
echo Installing npm packages...
call npm install

echo [✓] Frontend setup complete!
echo.

echo ==============================
echo Setup Complete!
echo.
echo To start the application:
echo.
echo 1. Start the backend:
echo    cd FieldServiceCRM
echo    dotnet run
echo.
echo 2. In a new terminal, start the frontend:
echo    cd frontend
echo    npm run dev
echo.
echo The app will be available at http://localhost:3000
echo ==============================
pause
