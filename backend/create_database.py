import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_database():
    try:
        # Connect to PostgreSQL server (not to a specific database)
        conn = psycopg2.connect(
            host="localhost",
            user="postgres", 
            password="yeshika",
            port=5432
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        
        # Check if database exists
        cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'lost_found_db'")
        exists = cur.fetchone()
        
        if not exists:
            # Create database
            cur.execute('CREATE DATABASE lost_found_db')
            print("✅ Database 'lost_found_db' created successfully!")
        else:
            print("✅ Database 'lost_found_db' already exists!")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error creating database: {e}")

if __name__ == '__main__':
    create_database()