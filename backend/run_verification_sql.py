import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

# Database connection
conn = psycopg2.connect(
    host="localhost",
    database="lost_found_db",
    user="postgres",
    password="yeshika"
)

cursor = conn.cursor()

# Add verification fields to matches table
sql_commands = [
    "ALTER TABLE matches ADD COLUMN IF NOT EXISTS verification_questions JSONB;",
    "ALTER TABLE matches ADD COLUMN IF NOT EXISTS verification_answers JSONB;",
    "ALTER TABLE matches ADD COLUMN IF NOT EXISTS verification_score DECIMAL(5,2);",
    "ALTER TABLE matches ADD COLUMN IF NOT EXISTS verification_verified BOOLEAN DEFAULT FALSE;",
    "ALTER TABLE matches ADD COLUMN IF NOT EXISTS verification_explanation TEXT;",
    "ALTER TABLE matches ADD COLUMN IF NOT EXISTS verification_generated_at TIMESTAMP;",
    "ALTER TABLE matches ADD COLUMN IF NOT EXISTS verification_completed_at TIMESTAMP;"
]

for sql in sql_commands:
    cursor.execute(sql)
    print(f"Executed: {sql}")

conn.commit()
cursor.close()
conn.close()

print("Database updated successfully!")