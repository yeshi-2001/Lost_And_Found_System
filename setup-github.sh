#!/bin/bash

# Back2U Lost & Found System - GitHub Setup Script
# This script helps initialize the GitHub repository

echo "🎓 Back2U Lost & Found System - GitHub Setup"
echo "============================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
else
    echo "✅ Git repository already exists"
fi

# Add all files
echo "📝 Adding files to Git..."
git add .

# Initial commit
echo "💾 Creating initial commit..."
git commit -m "feat: initial commit - Back2U Lost & Found System

- Complete React frontend with modern UI
- Flask backend with AI-powered matching
- PostgreSQL database with pgvector
- OpenAI integration for verification
- Docker containerization
- GitHub Actions CI/CD
- Comprehensive documentation"

# Check if remote origin exists
if git remote get-url origin &> /dev/null; then
    echo "✅ Remote origin already configured"
else
    echo "🔗 Please add your GitHub repository as remote origin:"
    echo "   git remote add origin https://github.com/yourusername/back2u-lost-found.git"
    echo ""
    read -p "Enter your GitHub repository URL: " repo_url
    if [ ! -z "$repo_url" ]; then
        git remote add origin "$repo_url"
        echo "✅ Remote origin added: $repo_url"
    fi
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
if git remote get-url origin &> /dev/null; then
    git branch -M main
    git push -u origin main
    echo "✅ Successfully pushed to GitHub!"
else
    echo "⚠️  Remote origin not configured. Please run:"
    echo "   git remote add origin https://github.com/yourusername/back2u-lost-found.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
fi

echo ""
echo "🎉 GitHub setup complete!"
echo ""
echo "Next steps:"
echo "1. 🌐 Visit your GitHub repository"
echo "2. 🔧 Configure repository settings"
echo "3. 🔑 Add secrets for GitHub Actions:"
echo "   - DOCKER_USERNAME"
echo "   - DOCKER_PASSWORD"
echo "   - HOST (for deployment)"
echo "   - USERNAME (for deployment)"
echo "   - SSH_KEY (for deployment)"
echo "4. 🏷️  Create your first release"
echo "5. 📋 Set up project board for issue tracking"
echo ""
echo "Happy coding! 🚀"