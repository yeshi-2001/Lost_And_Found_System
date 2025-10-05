import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = os.getenv('DATABASE_URL')

def add_verification_tables():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        # Create matches table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS matches (
                id SERIAL PRIMARY KEY,
                found_item_id INTEGER REFERENCES found_items(id) ON DELETE CASCADE,
                lost_item_id INTEGER REFERENCES lost_items(id) ON DELETE CASCADE,
                similarity_score DECIMAL(5,2) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending_verification',
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        """)
        
        # Create verification_attempts table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS verification_attempts (
                id SERIAL PRIMARY KEY,
                match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
                questions JSON NOT NULL,
                answers JSON,
                verification_score DECIMAL(5,2),
                verification_result VARCHAR(20),
                ai_response JSON,
                attempt_number INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT NOW()
            );
        """)
        
        # Create contact_exchanges table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS contact_exchanges (
                id SERIAL PRIMARY KEY,
                match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
                finder_contacted BOOLEAN DEFAULT FALSE,
                owner_contacted BOOLEAN DEFAULT FALSE,
                exchange_timestamp TIMESTAMP,
                return_confirmed BOOLEAN DEFAULT FALSE,
                return_timestamp TIMESTAMP,
                created_at TIMESTAMP DEFAULT NOW()
            );
        """)
        
        conn.commit()
        cur.close()
        conn.close()
        
        print("✅ Verification tables created successfully!")
        
    except Exception as e:
        print(f"❌ Error creating verification tables: {e}")

if __name__ == '__main__':
    add_verification_tables()