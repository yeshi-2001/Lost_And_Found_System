#!/usr/bin/env python3
"""
Setup script for Lost & Found System Backend
"""

import os
import subprocess
import sys
from dotenv import load_dotenv

def run_command(command, description):
    """Run a shell command and handle errors"""
    print(f"\n{description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✓ {description} completed successfully")
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"✗ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return None

def setup_environment():
    """Setup Python virtual environment and install dependencies"""
    print("Setting up Lost & Found System Backend...")
    
    # Create virtual environment
    if not os.path.exists('venv'):
        run_command('python -m venv venv', 'Creating virtual environment')
    
    # Activate virtual environment and install dependencies
    if os.name == 'nt':  # Windows
        activate_cmd = 'venv\\Scripts\\activate && '
    else:  # Unix/Linux/macOS
        activate_cmd = 'source venv/bin/activate && '
    
    run_command(f'{activate_cmd}pip install --upgrade pip', 'Upgrading pip')
    run_command(f'{activate_cmd}pip install -r requirements.txt', 'Installing dependencies')

def setup_database():
    """Setup database and run migrations"""
    load_dotenv()
    
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        print("⚠ DATABASE_URL not found in environment variables")
        print("Please set up your .env file with database configuration")
        return
    
    print("\nDatabase setup:")
    print("1. Make sure PostgreSQL is running")
    print("2. Create database: lost_found_db")
    print("3. Install pgvector extension")
    print("4. Run the migration SQL file")
    
    # Initialize Flask-Migrate
    if os.name == 'nt':  # Windows
        activate_cmd = 'venv\\Scripts\\activate && '
    else:  # Unix/Linux/macOS
        activate_cmd = 'source venv/bin/activate && '
    
    run_command(f'{activate_cmd}flask db init', 'Initializing Flask-Migrate')
    run_command(f'{activate_cmd}flask db migrate -m "Initial migration"', 'Creating migration')
    run_command(f'{activate_cmd}flask db upgrade', 'Running migrations')

def check_environment_variables():
    """Check if all required environment variables are set"""
    load_dotenv()
    
    required_vars = [
        'DATABASE_URL',
        'SECRET_KEY',
        'JWT_SECRET_KEY',
        'OPENAI_API_KEY'
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"\n⚠ Missing environment variables: {', '.join(missing_vars)}")
        print("Please set these in your .env file")
        return False
    
    print("\n✓ All required environment variables are set")
    return True

def main():
    """Main setup function"""
    print("🚀 Lost & Found System Backend Setup")
    print("=" * 50)
    
    # Setup environment
    setup_environment()
    
    # Check environment variables
    if not check_environment_variables():
        print("\nPlease configure your .env file and run setup again")
        return
    
    # Setup database
    setup_database()
    
    print("\n" + "=" * 50)
    print("✅ Setup completed successfully!")
    print("\nNext steps:")
    print("1. Configure your .env file with API keys")
    print("2. Run: python app.py")
    print("3. API will be available at http://localhost:5000")

if __name__ == "__main__":
    main()