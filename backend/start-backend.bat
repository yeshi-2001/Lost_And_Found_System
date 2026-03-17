@echo off
echo 🚀 Starting Back2U Backend Server...
echo.

REM Navigate to backend directory
cd /d "%~dp0"

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate

REM Install dependencies
echo 📚 Installing dependencies...
pip install -r requirements.txt

REM Check if .env exists
if not exist ".env" (
    echo ⚙️ Creating .env file...
    copy .env.example .env
    echo.
    echo ⚠️  Please edit .env file with your database credentials!
    echo.
    pause
)

REM Run the application
echo 🎯 Starting Flask server...
python app.py

pause