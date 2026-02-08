#!/bin/bash

echo "🚀 FieldFlow CRM Setup Script"
echo "=============================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

# Check .NET
if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET SDK not found. Please install .NET 8.0 or higher."
    exit 1
fi
echo "✅ .NET SDK found"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18 or higher."
    exit 1
fi
echo "✅ Node.js found"

echo ""
echo "Setting up Backend..."
cd FieldServiceCRM

# Restore .NET packages
echo "Restoring .NET packages..."
dotnet restore

# Create database migration
echo "Creating database migration..."
dotnet ef migrations add InitialCreate

# Update database
echo "Updating database..."
dotnet ef database update

echo "✅ Backend setup complete!"
echo ""

# Setup Frontend
echo "Setting up Frontend..."
cd ../frontend

# Install npm packages
echo "Installing npm packages..."
npm install

echo "✅ Frontend setup complete!"
echo ""

echo "=============================="
echo "🎉 Setup Complete!"
echo ""
echo "To start the application:"
echo ""
echo "1. Start the backend:"
echo "   cd FieldServiceCRM"
echo "   dotnet run"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "The app will be available at http://localhost:3000"
echo "=============================="
