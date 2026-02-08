# Step-by-Step Setup & Diagnostics

## What You Need First

Before starting, make sure you have:
- [ ] .NET 8.0 SDK or higher installed
- [ ] Node.js 18+ and npm installed
- [ ] A code editor (VS Code, Visual Studio, etc.)
- [ ] Terminal/Command Prompt access

**Check your installations:**
```bash
dotnet --version    # Should show 8.0.x or higher
node --version      # Should show v18.x.x or higher
npm --version       # Should show 9.x.x or higher
```

## Setup Option A: Using SQL Server (Default)

### Prerequisites
- SQL Server or SQL Server LocalDB installed

### Steps

**1. Setup Backend**
```bash
cd FieldServiceCRM

# Install EF Core tools (if not already installed)
dotnet tool install --global dotnet-ef

# Restore packages
dotnet restore

# Create database migration
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update

# Run the backend
dotnet run
```

**Expected Output:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
```

✅ **Test:** Open http://localhost:5000/swagger - you should see the API documentation

**2. Setup Frontend (in a NEW terminal)**
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:3000/
```

✅ **Test:** Open http://localhost:3000 - you should see the FieldFlow login page

## Setup Option B: Using SQLite (Easier, No SQL Server Needed)

### Steps

**1. Switch to SQLite**
```bash
cd FieldServiceCRM
```

Edit `FieldServiceCRM.csproj`:
- Comment out: `<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />`
- Uncomment: `<PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="8.0.0" />`

Or add this line to the ItemGroup:
```xml
<PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="8.0.0" />
```

Edit `Program.cs` (around line 14-17):
- Comment out the UseSqlServer line
- Uncomment the UseSqlite line

Or replace with:
```csharp
builder.Services.AddDbContext<CrmDbContext>(options =>
    options.UseSqlite("Data Source=fieldservice.db"));
```

**2. Run Setup**
```bash
# Restore packages with new dependency
dotnet restore

# Create migration
dotnet ef migrations add InitialCreate

# Create database
dotnet ef database update

# Run backend
dotnet run
```

**3. Setup Frontend (same as Option A)**
```bash
cd frontend
npm install
npm run dev
```

## Diagnostic Checklist

### ❌ Problem: "dotnet: command not found"
**Solution:** Install .NET SDK from https://dotnet.microsoft.com/download

### ❌ Problem: "npm: command not found"  
**Solution:** Install Node.js from https://nodejs.org/

### ❌ Problem: "dotnet ef: command not found"
**Solution:**
```bash
dotnet tool install --global dotnet-ef
```

### ❌ Problem: "Unable to connect to SQL Server"
**Solutions:**
1. **Easiest:** Switch to SQLite (see Option B above)
2. Install SQL Server Express: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
3. Use Docker: `docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Pass@word123" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest`

### ❌ Problem: "Port 5000 already in use"
**Solution:** Change the port in `Properties/launchSettings.json`:
```json
"applicationUrl": "http://localhost:5001"
```
Then update `frontend/src/App.jsx`:
```javascript
const API_BASE = 'http://localhost:5001/api';
```

### ❌ Problem: "Port 3000 already in use"
**Solution:** Change the port in `frontend/vite.config.js`:
```javascript
server: {
  port: 3001
}
```

### ❌ Problem: CORS errors in browser console
**Solution:** Make sure backend is running AND the CORS policy in `Program.cs` includes your frontend URL:
```csharp
policy.WithOrigins("http://localhost:3000", "http://localhost:3001", "http://localhost:5173")
```

### ❌ Problem: Frontend loads but shows "Loading..." forever
**Causes & Solutions:**
1. Backend not running → Start backend first
2. Wrong API URL → Check `API_BASE` in `App.jsx` matches backend port
3. CORS issue → Check browser console for errors

### ❌ Problem: "This site can't be reached"
**Causes & Solutions:**
1. Frontend not running → Run `npm run dev` in frontend folder
2. Wrong URL → Make sure you're accessing http://localhost:3000 (not https)
3. Port conflict → Change port in vite.config.js

## Quick Verification Commands

**Check if backend is running:**
```bash
curl http://localhost:5000/api/customers
# or open in browser: http://localhost:5000/swagger
```

**Check if frontend is running:**
```bash
curl http://localhost:3000
# or open in browser: http://localhost:3000
```

**Check database file (SQLite):**
```bash
cd FieldServiceCRM
ls -la fieldservice.db  # Should exist after migration
```

**Check processes:**
```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :5000
lsof -i :3000
```

## Success Checklist

You'll know it's working when:
- ✅ Backend running on port 5000 (or your chosen port)
- ✅ Swagger UI accessible at http://localhost:5000/swagger
- ✅ Frontend running on port 3000 (or your chosen port)
- ✅ Can open http://localhost:3000 and see the FieldFlow interface
- ✅ Dashboard shows metrics (may be zeros initially)
- ✅ Can click "Add New" and see a modal form
- ✅ Sample customers visible in Customers tab

## Starting Fresh (Reset Everything)

If you want to start completely over:

```bash
# Delete database
cd FieldServiceCRM
rm fieldservice.db  # For SQLite
# OR
dotnet ef database drop  # For SQL Server

# Delete migrations
rm -rf Migrations/

# Recreate
dotnet ef migrations add InitialCreate
dotnet ef database update

# Clean frontend
cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

## Getting Help

If you're still stuck:

1. **Check the logs:**
   - Backend: Look at terminal where `dotnet run` is running
   - Frontend: Check browser Developer Tools Console (F12)

2. **Verify the setup:**
   - Is backend running? Check http://localhost:5000/swagger
   - Is frontend running? Check http://localhost:3000
   - Are they on the right ports? Check API_BASE in App.jsx

3. **Common mistakes:**
   - Forgot to run migrations
   - Backend and frontend on wrong ports
   - SQL Server not installed (use SQLite instead)
   - Not running both backend AND frontend
   - Running frontend before backend

## Development Tips

**Run both in one command (optional):**
Create a script or use a tool like `concurrently`:
```bash
npm install -g concurrently
concurrently "cd FieldServiceCRM && dotnet run" "cd frontend && npm run dev"
```

**Use VS Code:**
Open both folders in workspace and use integrated terminals

**Use Visual Studio:**
Open FieldServiceCRM.sln, press F5 for backend, then run frontend separately

---

Need more help? Check TROUBLESHOOTING.md for detailed error solutions!
