# Troubleshooting Guide - "This site can't be reached"

## Quick Fix Steps

### Step 1: Check if Backend is Running

Open a terminal and run:
```bash
cd FieldServiceCRM
dotnet run
```

**Expected output:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
      Now listening on: https://localhost:5001
```

**If you see errors:**

#### Error: "Unable to create migrations"
```bash
# Install EF Core tools globally
dotnet tool install --global dotnet-ef

# Then try again
dotnet ef migrations add InitialCreate
dotnet ef database update
```

#### Error: "Connection string error"
Your SQL Server might not be installed. **Options:**

**Option A - Use SQLite (Easier):**
1. Open `FieldServiceCRM/FieldServiceCRM.csproj`
2. Replace the SQL Server package reference:
```xml
<!-- Replace this line -->
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />

<!-- With this line -->
<PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="8.0.0" />
```

3. Update `Program.cs` (around line 14):
```csharp
// Replace this line:
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// With this line:
options.UseSqlite("Data Source=fieldservice.db");
```

4. Run migrations again:
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run
```

**Option B - Install SQL Server:**
- Windows: Install [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- Mac: Use Docker: `docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourPassword123!" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest`

### Step 2: Check if Frontend is Running

Open a **NEW** terminal (keep backend running) and run:
```bash
cd frontend
npm install
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**If you see errors:**

#### Error: "npm not found"
Install Node.js from https://nodejs.org/ (LTS version recommended)

#### Error: "Port 3000 already in use"
Change the port in `frontend/vite.config.js`:
```javascript
server: {
  port: 3001  // Change to any free port
}
```

### Step 3: Verify Both Are Running

You should have **TWO terminals open**:
1. Backend running on port 5000
2. Frontend running on port 3000

Try accessing:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/swagger

## Common Issues & Solutions

### Issue: CORS Error (in browser console)

**Symptom:** You see the page but no data loads. Browser console shows CORS errors.

**Solution:** Make sure your backend CORS policy matches the frontend URL.

In `Program.cs`, verify:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

### Issue: 404 on API calls

**Symptom:** Frontend loads but API calls fail.

**Solution:** Check the API base URL in `frontend/src/App.jsx` (around line 8):
```javascript
const API_BASE = 'http://localhost:5000/api';  // Make sure port matches your backend
```

### Issue: "Cannot find module" errors

**Solution:** 
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database errors

**Solution:** Delete the database and recreate:
```bash
cd FieldServiceCRM
dotnet ef database drop
dotnet ef database update
```

## Alternative: All-in-One Minimal Setup

If you're having too many issues, here's a simplified version using SQLite:

<function_calls>
<invoke name="bash_tool">
<parameter name="command">cat > /home/claude/ALTERNATIVE_SETUP.md << 'EOF'
# Alternative Simple Setup

## Use SQLite Instead of SQL Server

1. Update FieldServiceCRM.csproj:
```bash
cd FieldServiceCRM
# Edit FieldServiceCRM.csproj and replace SqlServer with Sqlite
```

2. Update Program.cs:
```csharp
// Change line ~14 from:
options.UseSqlServer(...)

// To:
options.UseSqlite("Data Source=fieldservice.db")
```

3. Run:
```bash
dotnet restore
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run
```

4. In new terminal:
```bash
cd ../frontend
npm install
npm run dev
```

5. Open http://localhost:3000

## Still Having Issues?

### Quick Test - Backend Only
```bash
cd FieldServiceCRM
dotnet run
```
Then open: http://localhost:5000/swagger

If this works, backend is good!

### Quick Test - Frontend Only  
```bash
cd frontend
npm run dev
```
Then open: http://localhost:3000

If page loads (even with errors), frontend is good!

### Both Tests Pass But No Data?
Check API_BASE in App.jsx matches your backend port.
EOF
cat /home/claude/ALTERNATIVE_SETUP.md
