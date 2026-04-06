#!/bin/bash
# ============================================================
# VAYU SAINIK — Git Setup & Push Script
# Run this in Git Bash from inside the vayu-sena folder
# ============================================================

echo ""
echo "🌬️  Vayu Sainik — Git Setup"
echo "=============================="
echo ""

# Check if git is available
if ! command -v git &> /dev/null; then
  echo "❌ Git not found. Please install Git first."
  exit 1
fi

# Initialize git if not already done
if [ ! -d ".git" ]; then
  echo "📁 Initializing git repository..."
  git init
  echo "✅ Git initialized."
else
  echo "✅ Git already initialized."
fi

# Set git config (update these if needed)
echo ""
echo "⚙️  Configuring git user..."
git config user.name "DivyangP2003"
git config user.email "divyangdpalshetkar@gmail.com"

# Create .env.local from .env.example if it doesn't exist
if [ ! -f ".env.local" ]; then
  echo ""
  echo "📋 Creating .env.local from .env.example..."
  cp .env.example .env.local
  echo "✅ .env.local created. Add your API keys to it!"
fi

# Stage all files
echo ""
echo "📦 Staging all files..."
git add .

# Check what's staged
echo ""
echo "📋 Files ready to commit:"
git status --short

# Commit
echo ""
echo "💾 Creating initial commit..."
git commit -m "🚀 Initial commit — Vayu Sainik full-stack app

- Next.js 14 App Router with TypeScript
- Live AQI dashboard for 20+ Indian cities  
- Interactive India map with Leaflet.js
- Gemini AI flash notes (health tips + source analysis)
- Citizen pollution reporting system
- Real-time AQI alerts page
- 14-day trend charts with Chart.js
- CPCB + OpenAQ + NASA MODIS data pipeline
- Mock data fallback for all APIs
- Vercel deployment ready (Mumbai region)
- Full .env.example with all API key docs"

echo ""
echo "✅ Commit created."

# Set remote origin
echo ""
echo "🔗 Setting remote origin..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/DivyangP2003/vayu-sena.git
echo "✅ Remote set to: https://github.com/DivyangP2003/vayu-sena.git"

# Rename branch to main
git branch -M main

# Push to GitHub
echo ""
echo "🚀 Pushing to GitHub..."
echo "   (You may be prompted for your GitHub credentials)"
echo "   Tip: Use a Personal Access Token as password"
echo "   Get one at: https://github.com/settings/tokens"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ SUCCESS! Code pushed to GitHub."
  echo ""
  echo "📌 Next steps:"
  echo "   1. Go to https://vercel.com/new"
  echo "   2. Import: github.com/DivyangP2003/vayu-sena"
  echo "   3. Add environment variables in Vercel dashboard:"
  echo "      - GEMINI_API_KEY"
  echo "      - OPENAQ_API_KEY"
  echo "      - OPENWEATHER_API_KEY"
  echo "   4. Deploy! (Vercel auto-detects Next.js)"
  echo ""
  echo "🌬️  Vayu Sainik will be live at your Vercel URL!"
else
  echo ""
  echo "❌ Push failed. Try:"
  echo "   git push -u origin main"
  echo ""
  echo "   If auth fails, use Personal Access Token:"
  echo "   https://github.com/settings/tokens/new"
  echo "   Scopes needed: repo"
fi
