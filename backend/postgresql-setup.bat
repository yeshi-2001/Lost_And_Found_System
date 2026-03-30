@echo off
echo 🐘 PostgreSQL Setup & Password Reset Guide
echo ==========================================
echo.

echo 📋 Step 1: Check if PostgreSQL is running
echo Run this command in Command Prompt as Administrator:
echo    net start postgresql-x64-15
echo    (or postgresql-x64-14, postgresql-x64-13 depending on your version)
echo.

echo 📋 Step 2: Reset PostgreSQL password
echo Method 1 - Using psql (if you can access):
echo    psql -U postgres
echo    ALTER USER postgres PASSWORD 'newpassword';
echo    \q
echo.

echo Method 2 - Using pg_hba.conf (if locked out):
echo    1. Find pg_hba.conf file (usually in PostgreSQL data directory)
echo    2. Change 'md5' to 'trust' for local connections
echo    3. Restart PostgreSQL service
echo    4. Connect without password: psql -U postgres
echo    5. Change password: ALTER USER postgres PASSWORD 'newpassword';
echo    6. Change 'trust' back to 'md5' in pg_hba.conf
echo    7. Restart PostgreSQL service
echo.

echo 📋 Step 3: Create database
echo    createdb -U postgres lost_found_db
echo    psql -U postgres -d lost_found_db -c "CREATE EXTENSION vector;"
echo.

echo 📋 Step 4: Update .env file
echo    Edit backend/.env file with your new password
echo.

echo 📋 Step 5: Test connection
echo    cd backend
echo    python -c "import psycopg2; conn = psycopg2.connect('postgresql://postgres:newpassword@localhost:5432/lost_found_db'); print('✅ Connection successful!')"
echo.

pause