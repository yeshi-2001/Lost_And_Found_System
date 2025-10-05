import psycopg2
from psycopg2 import sql
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:yeshika@localhost:5432/lost_found_db')

def add_reset_password_columns():
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        # Add reset_password_token column
        cursor.execute("""
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR(255);
        """)
        
        # Add reset_password_expiry column
        cursor.execute("""
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS reset_password_expiry TIMESTAMP;
        """)
        
        # Commit changes
        conn.commit()
        print("Successfully added reset password columns to users table")
        
    except Exception as e:
        print(f"Error adding columns: {e}")
        if conn:
            conn.rollback()
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    add_reset_password_columns()