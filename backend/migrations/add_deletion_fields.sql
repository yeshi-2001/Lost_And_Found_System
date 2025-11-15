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

-- For users table (if exists, otherwise students table)
ALTER TABLE students ADD COLUMN IF NOT EXISTS account_status VARCHAR(20) DEFAULT 'active';
ALTER TABLE students ADD COLUMN IF NOT EXISTS inactive_since TIMESTAMP NULL;
ALTER TABLE students ADD COLUMN IF NOT EXISTS deletion_requested_at TIMESTAMP NULL;
ALTER TABLE students ADD COLUMN IF NOT EXISTS deletion_scheduled_for TIMESTAMP NULL;

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