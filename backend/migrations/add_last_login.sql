-- Add last_login field to users table
ALTER TABLE users ADD COLUMN last_login TIMESTAMP;

-- Set initial last_login to current timestamp for existing users
UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE last_login IS NULL;