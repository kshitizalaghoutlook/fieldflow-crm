#!/bin/bash

echo "========================================"
echo "GitHub Pages Deployment Setup"
echo "========================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git not initialized!"
    echo "First, push your code to GitHub:"
    echo ""
    echo "  git init"
    echo "  git add ."
    echo "  git commit -m 'Initial commit'"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/fieldflow-crm.git"
    echo "  git push -u origin main"
    echo ""
    exit 1
fi

echo "✅ Git repository found"
echo ""

# Get GitHub username and repo
echo "Enter your GitHub username:"
read GITHUB_USER

echo "Enter your repository name (e.g., fieldflow-crm):"
read REPO_NAME

echo ""
echo "Enter your backend URL (from Railway/Render):"
echo "Example: https://your-app.railway.app"
read BACKEND_URL

# Validate backend URL
if [ -z "$BACKEND_URL" ]; then
    echo "⚠️  No backend URL provided. Using localhost (won't work on GitHub Pages)"
    BACKEND_URL="http://localhost:5000"
fi

echo ""
echo "Configuration:"
echo "  GitHub User: $GITHUB_USER"
echo "  Repository: $REPO_NAME"
echo "  Backend URL: $BACKEND_URL"
echo "  GitHub Pages URL: https://$GITHUB_USER.github.io/$REPO_NAME/"
echo ""
echo "Is this correct? (y/n)"
read CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "Aborted."
    exit 0
fi

echo ""
echo "Step 1: Updating frontend configuration..."

# Update package.json homepage
cd frontend
HOMEPAGE="https://$GITHUB_USER.github.io/$REPO_NAME"
sed -i.bak "s|YOUR_USERNAME.github.io/fieldflow-crm|$GITHUB_USER.github.io/$REPO_NAME|g" package.json
rm -f package.json.bak

# Update vite.config.js base
sed -i.bak "s|base: '/fieldflow-crm/'|base: '/$REPO_NAME/'|g" vite.config.js
rm -f vite.config.js.bak

# Update API_BASE in App.jsx
API_URL="${BACKEND_URL}/api"
sed -i.bak "s|const API_BASE = 'http://localhost:5000/api';|const API_BASE = '${API_URL}';|g" src/App.jsx
rm -f src/App.jsx.bak

echo "✅ Frontend configuration updated"
echo ""

echo "Step 2: Installing dependencies..."
npm install
npm install --save-dev gh-pages

echo "✅ Dependencies installed"
echo ""

echo "Step 3: Building frontend..."
npm run build

echo "✅ Frontend built"
echo ""

echo "Step 4: Deploying to GitHub Pages..."
npm run deploy

echo ""
echo "========================================"
echo "✅ Deployment Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Go to: https://github.com/$GITHUB_USER/$REPO_NAME/settings/pages"
echo "2. Under 'Source', select: gh-pages branch"
echo "3. Click 'Save'"
echo ""
echo "Your app will be live at:"
echo "  https://$GITHUB_USER.github.io/$REPO_NAME/"
echo ""
echo "⚠️  IMPORTANT: Update your backend CORS!"
echo "In FieldServiceCRM/Program.cs, add:"
echo "  policy.WithOrigins("
echo "    \"https://$GITHUB_USER.github.io\""
echo "  )"
echo ""
echo "Then commit, push, and your backend will auto-redeploy."
echo "========================================"
