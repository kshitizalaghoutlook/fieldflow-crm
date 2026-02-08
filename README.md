# FieldFlow - Field Service CRM

A modern, full-featured field service management CRM built with React and .NET 10.

## Features

- **Customer Management** - Complete CRUD operations for customer data
- **Job Scheduling** - Visual calendar with drag-and-drop scheduling
- **Technician Assignment** - Assign jobs to technicians with real-time availability
- **Invoice Management** - Generate, track, and manage invoices
- **Dashboard Analytics** - Real-time metrics and KPIs
- **Modern UI** - Sleek, professional interface with smooth animations

## Tech Stack

### Backend
- .NET 10 Web API
- Entity Framework Core 8.0
- SQL Server
- RESTful API architecture

### Frontend
- React 18
- Vite
- Lucide React Icons
- Custom CSS animations

## Getting Started

### Prerequisites

- .NET 10 SDK
- Node.js 18+ and npm
- SQL Server or SQL Server LocalDB

### Backend Setup

1. Navigate to the backend directory:
```bash
cd FieldServiceCRM
```

2. Update the connection string in `appsettings.json` if needed:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=FieldServiceCRM;Trusted_Connection=true;MultipleActiveResultSets=true"
}
```

3. Install dependencies and create the database:
```bash
dotnet restore
dotnet ef migrations add InitialCreate
dotnet ef database update
```

4. Run the backend:
```bash
dotnet run
```

The API will be available at `https://localhost:5001` (or `http://localhost:5000`)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update the API base URL in `src/App.jsx` if your backend runs on a different port:
```javascript
const API_BASE = 'http://localhost:5000/api';
```

4. Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## API Endpoints

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs?customerId={id}` - Get jobs by customer
- `GET /api/jobs?technicianId={id}` - Get jobs by technician
- `GET /api/jobs?startDate={date}&endDate={date}` - Get jobs by date range
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/{id}` - Update job
- `DELETE /api/jobs/{id}` - Delete job

### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices?customerId={id}` - Get invoices by customer
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/{id}` - Update invoice
- `DELETE /api/invoices/{id}` - Delete invoice
- `GET /api/invoices/{id}/pdf` - Generate PDF (placeholder)

### Technicians
- `GET /api/technicians` - Get all technicians
- `GET /api/technicians/{id}` - Get technician by ID
- `POST /api/technicians` - Create new technician
- `PUT /api/technicians/{id}` - Update technician
- `DELETE /api/technicians/{id}` - Delete technician

## Database Schema

### Customers
- Id (PK)
- Name
- ContactPerson
- Email
- Phone
- Address
- CreatedDate
- IsActive

### Jobs
- Id (PK)
- CustomerId (FK)
- Title
- Description
- Status (pending, scheduled, in-progress, completed, cancelled)
- Priority (low, medium, high, urgent)
- ScheduledDate
- CompletedDate
- AssignedTechnicianId (FK)
- EstimatedHours
- ActualHours
- InvoiceId (FK)
- CreatedDate
- UpdatedDate

### Invoices
- Id (PK)
- CustomerId (FK)
- InvoiceNumber
- InvoiceDate
- DueDate
- Subtotal
- TaxAmount
- Total
- Status (draft, sent, paid, overdue, cancelled)
- PaidDate
- Notes
- CreatedDate

### InvoiceItems
- Id (PK)
- InvoiceId (FK)
- Description
- Quantity
- UnitPrice
- Amount

### Technicians
- Id (PK)
- Name
- Email
- Phone
- Specialization
- IsActive
- HourlyRate
- HireDate

## Project Structure

```
FieldServiceCRM/
├── Controllers/          # API Controllers
├── Data/                # DbContext and configurations
├── DTOs/                # Data Transfer Objects
├── Models/              # Entity models
├── Services/            # Business logic layer
├── Program.cs           # Application entry point
├── appsettings.json     # Configuration
└── FieldServiceCRM.csproj

frontend/
├── src/
│   ├── App.jsx         # Main application component
│   └── main.jsx        # React entry point
├── index.html          # HTML template
├── package.json        # Dependencies
└── vite.config.js      # Vite configuration
```

## Features in Detail

### Dashboard
- Total customers count
- Active jobs tracking
- Pending invoices
- Monthly revenue calculation
- Upcoming jobs list

### Customer Management
- Add/Edit/Delete customers
- View customer details
- Track jobs per customer
- Calculate total revenue per customer
- Search functionality

### Job Management
- Create and assign jobs
- Set priority levels
- Schedule jobs with date/time
- Track job status
- Filter by status
- View job history

### Calendar Schedule
- Month view calendar
- Visual job scheduling
- Color-coded priorities
- Multiple jobs per day
- Navigate between months

### Invoice Management
- Auto-generate invoice numbers
- Calculate subtotal, tax, and total
- Track payment status
- Link jobs to invoices
- Multiple invoice items

## Customization

### Changing Colors
The app uses CSS custom properties. Main colors:
- Primary: `#00d4ff` (cyan)
- Success: `#00ff9d` (green)
- Warning: `#ffc107` (yellow)
- Error: `#ff4757` (red)
- Background: `#0a0e27` (dark blue)

### Adding New Fields
1. Update the model in `Models/Models.cs`
2. Update the DTO in `DTOs/DTOs.cs`
3. Create and apply migration
4. Update the service layer
5. Update the frontend form

## Production Deployment

### Backend
1. Update `appsettings.Production.json` with production connection string
2. Build for production:
```bash
dotnet publish -c Release
```
3. Deploy to your hosting provider (Azure, AWS, etc.)

### Frontend
1. Update API base URL to production endpoint
2. Build for production:
```bash
npm run build
```
3. Deploy the `dist` folder to your static hosting

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this for your projects.

## Support

For questions or support, please open an issue on the repository.
