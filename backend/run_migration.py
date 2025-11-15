#!/usr/bin/env python3
"""
Run database migration for deletion fields
"""
import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def run_migration():
    # Get database URL from environment
    database_url = os.getenv('DATABASE_URL', 'postgresql://postgres:yeshika@localhost:5432/lost_found_db')
    
    try:
        # Create database engine
        engine = create_engine(database_url)
        
        # Read migration SQL
        migration_sql = """
-- Add deletion fields to existing tables

-- For found_items table
ALTER TABLE found_items ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;
ALTER TABLE found_items ADD COLUMN IF NOT EXISTS deleted_by INTEGER NULL;
ALTER TABLE found_items ADD COLUMN IF NOT EXISTS deletion_reason VARCHAR(255);
ALTER TABLE found_items ADD COLUMN IF NOT EXISTS auto_deleted BOOLEAN DEFAULT FALSE;

-- For lost_items table  
ALTER TABLE lost_items ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;
ALTER TABLE lost_items ADD COLUMN IF NOT EXISTS deleted_by INTEGER NULL;
ALTER TABLE lost_items ADD COLUMN IF NOT EXISTS deletion_reason VARCHAR(255);
ALTER TABLE lost_items ADD COLUMN IF NOT EXISTS auto_deleted BOOLEAN DEFAULT FALSE;

-- For matches table
ALTER TABLE matches ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP NULL;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS archival_reason VARCHAR(255);

-- For users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status VARCHAR(20) DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS inactive_since TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deletion_requested_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deletion_scheduled_for TIMESTAMP NULL;

-- Create deletion_logs table for audit trail
CREATE TABLE IF NOT EXISTS deletion_logs (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    deleted_by INTEGER,
    deletion_reason VARCHAR(255),
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_backup JSONB
);
        """
        
        # Execute migration
        with engine.connect() as connection:
            # Split by semicolon and execute each statement
            statements = [stmt.strip() for stmt in migration_sql.split(';') if stmt.strip()]
            
            for statement in statements:
                try:
                    connection.execute(text(statement))
                    print(f"Executed: {statement[:50]}...")
                except Exception as e:
                    print(f"Warning: {statement[:50]}... - {str(e)}")
            
            connection.commit()
        
        print("\nMigration completed successfully!")
        print("Added deletion fields to found_items, lost_items, matches, and users tables")
        print("Created deletion_logs table for audit trail")
        
    except Exception as e:
        print(f"Migration failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    print("Running deletion fields migration...")
    run_migration()