# FieldFlow CRM - Quick Start Guide

## What You've Got

A complete field service management CRM with:
- ✅ .NET 10 backend API with Entity Framework Core
- ✅ React frontend with modern, professional UI
- ✅ Full CRUD operations for customers, jobs, invoices
- ✅ Visual calendar scheduling
- ✅ Technician management and assignment
- ✅ Real-time dashboard with metrics

## 5-Minute Setup

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

**Backend:**
```bash
cd FieldServiceCRM
dotnet restore
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run
```

**Frontend (in a new terminal):**
```bash
cd frontend
npm install
npm run dev
```

## First Steps

1. **Access the app**: Open http://localhost:3000
2. **Explore the Dashboard**: View metrics and upcoming jobs
3. **Add a Customer**: Click "+ Add New" in the Customers view
4. **Create a Job**: Assign it to a technician and schedule it
5. **Generate Invoice**: Create an invoice for completed jobs
6. **Check the Calendar**: See all scheduled jobs visually

## Default Data

The system comes pre-seeded with:
- 3 sample customers
- 4 technicians with different specializations
- You can delete these or add your own

## Key Technologies

**Backend:**
- ASP.NET Core Web API
- Entity Framework Core 8.0
- SQL Server/LocalDB
- Service Layer Pattern
- RESTful architecture

**Frontend:**
- React 18 with Hooks
- Vite for fast development
- Lucide React for icons
- CSS-in-JS styling
- Responsive design

## Project Structure

```
FieldServiceCRM/
├── FieldServiceCRM/        # Backend .NET project
│   ├── Controllers/        # API endpoints
│   ├── Services/          # Business logic
│   ├── Models/            # Database entities
│   ├── DTOs/              # Data transfer objects
│   └── Data/              # DbContext
│
├── frontend/              # React frontend
│   ├── src/
│   │   ├── App.jsx       # Main component
│   │   └── main.jsx      # Entry point
│   └── package.json
│
├── README.md             # Full documentation
└── setup.sh/bat          # Setup scripts
```

## Configuration

### Backend Port (default: 5000)
Edit `FieldServiceCRM/Properties/launchSettings.json`:
```json
"applicationUrl": "http://localhost:5000"
```

### Frontend Port (default: 3000)
Edit `frontend/vite.config.js`:
```javascript
server: { port: 3000 }
```

### Database Connection
Edit `FieldServiceCRM/appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=FieldServiceCRM;..."
}
```

### API Endpoint in Frontend
Edit `frontend/src/App.jsx`:
```javascript
const API_BASE = 'http://localhost:5000/api';
```

## Common Issues

**"Database update failed"**
- Make sure SQL Server LocalDB is installed
- Try: `SqlLocalDB create MSSQLLocalDB`

**"Port already in use"**
- Change the port in configuration files
- Kill the process: `netstat -ano | findstr :5000` (Windows)

**"CORS error"**
- Check that the backend CORS policy includes your frontend URL
- Default includes localhost:3000

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:5000/swagger
- API docs with all endpoints and schemas

## Customization Tips

**Change Theme Colors:**
The main colors in `App.jsx`:
- Primary: `#00d4ff` (cyan)
- Success: `#00ff9d` (green)  
- Warning: `#ffc107` (yellow)

**Add New Fields:**
1. Update Model in `Models/`
2. Update DTO in `DTOs/`
3. Run migration: `dotnet ef migrations add YourMigrationName`
4. Update frontend forms

**Add New Status:**
Update enums in backend and add to status badge mappings in frontend

## Production Deployment

**Backend:**
- Update connection string for production database
- Build: `dotnet publish -c Release`
- Deploy to Azure, AWS, or your preferred host

**Frontend:**
- Update API_BASE to production URL
- Build: `npm run build`
- Deploy `dist/` folder to static hosting (Vercel, Netlify, etc.)

## Next Steps

1. ✅ Customize the seeded data for your business
2. ✅ Add your logo and branding
3. ✅ Configure email notifications
4. ✅ Add PDF generation for invoices
5. ✅ Implement authentication/authorization
6. ✅ Add reporting and analytics
7. ✅ Mobile responsive improvements

## Support

Need help?
- Check the full README.md for detailed docs
- Review API documentation in Swagger
- Common patterns are well-documented in the code

## What's Included

✅ Customer Management (full CRUD)
✅ Job Scheduling & Tracking
✅ Technician Assignment
✅ Invoice Generation
✅ Calendar View
✅ Dashboard with Metrics
✅ Search & Filtering
✅ Status & Priority Management
✅ Responsive Design
✅ Professional UI/UX

## Database Schema Highlights

- **Soft deletes** for customers and technicians
- **Relational integrity** with foreign keys
- **Automatic timestamps** on records
- **Invoice number auto-generation**
- **Indexed fields** for performance

Enjoy building your field service business with FieldFlow! 🚀
