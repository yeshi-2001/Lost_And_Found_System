@echo off
REM Back2U Lost & Found System - GitHub Setup Script (Windows)
REM This script helps initialize the GitHub repository

echo 🎓 Back2U Lost & Found System - GitHub Setup
echo =============================================

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

REM Check if we're in a git repository
if not exist ".git" (
    echo 📁 Initializing Git repository...
    git init
) else (
    echo ✅ Git repository already exists
)

REM Add all files
echo 📝 Adding files to Git...
git add .

REM Initial commit
echo 💾 Creating initial commit...
git commit -m "feat: initial commit - Back2U Lost & Found System" -m "" -m "- Complete React frontend with modern UI" -m "- Flask backend with AI-powered matching" -m "- PostgreSQL database with pgvector" -m "- OpenAI integration for verification" -m "- Docker containerization" -m "- GitHub Actions CI/CD" -m "- Comprehensive documentation"

REM Check if remote origin exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo 🔗 Please add your GitHub repository as remote origin:
    echo    git remote add origin https://github.com/yourusername/back2u-lost-found.git
    echo.
    set /p repo_url="Enter your GitHub repository URL: "
    if not "!repo_url!"=="" (
        git remote add origin "!repo_url!"
        echo ✅ Remote origin added: !repo_url!
    )
) else (
    echo ✅ Remote origin already configured
)

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git remote get-url origin >nul 2>&1
if not errorlevel 1 (
    git branch -M main
    git push -u origin main
    echo ✅ Successfully pushed to GitHub!
) else (
    echo ⚠️  Remote origin not configured. Please run:
    echo    git remote add origin https://github.com/yourusername/back2u-lost-found.git
    echo    git branch -M main
    echo    git push -u origin main
)

echo.
echo 🎉 GitHub setup complete!
echo.
echo Next steps:
echo 1. 🌐 Visit your GitHub repository
echo 2. 🔧 Configure repository settings
echo 3. 🔑 Add secrets for GitHub Actions:
echo    - DOCKER_USERNAME
echo    - DOCKER_PASSWORD
echo    - HOST (for deployment)
echo    - USERNAME (for deployment)
echo    - SSH_KEY (for deployment)
echo 4. 🏷️  Create your first release
echo 5. 📋 Set up project board for issue tracking
echo.
echo Happy coding! 🚀
pause