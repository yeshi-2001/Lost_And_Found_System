import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

# Database connection
DATABASE_URL = os.getenv('DATABASE_URL')

def create_tables():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        # Create users table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                registration_number VARCHAR(100) UNIQUE NOT NULL,
                department VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                contact_number VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        """)
        
        # Create found_items table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS found_items (
                id SERIAL PRIMARY KEY,
                reference_number VARCHAR(50) UNIQUE NOT NULL,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                category VARCHAR(100) NOT NULL,
                item_name VARCHAR(255) NOT NULL,
                brand VARCHAR(100),
                color VARCHAR(50) NOT NULL,
                location_found VARCHAR(255) NOT NULL,
                date_found DATE NOT NULL,
                description TEXT NOT NULL,
                contact_number VARCHAR(20) NOT NULL,
                image_urls TEXT[],
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT NOW()
            );
        """)
        
        # Create lost_items table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS lost_items (
                id SERIAL PRIMARY KEY,
                reference_number VARCHAR(50) UNIQUE NOT NULL,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                category VARCHAR(100) NOT NULL,
                item_name VARCHAR(255) NOT NULL,
                brand VARCHAR(100),
                color VARCHAR(50) NOT NULL,
                location_lost VARCHAR(255) NOT NULL,
                location_details TEXT,
                date_lost DATE NOT NULL,
                description TEXT NOT NULL,
                additional_information TEXT,
                contact_number VARCHAR(20) NOT NULL,
                image_urls TEXT[],
                status VARCHAR(50) DEFAULT 'searching',
                created_at TIMESTAMP DEFAULT NOW()
            );
        """)
        
        conn.commit()
        cur.close()
        conn.close()
        
        print("✅ Database tables created successfully!")
        
    except Exception as e:
        print(f"❌ Error creating tables: {e}")

if __name__ == '__main__':
    create_tables()