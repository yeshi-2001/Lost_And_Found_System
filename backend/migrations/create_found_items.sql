-- Drop existing found_items table if it exists
DROP TABLE IF EXISTS found_items CASCADE;

-- Create found_items table with all required fields
CREATE TABLE found_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    color VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    date_found DATE NOT NULL,
    description TEXT NOT NULL,
    image_urls TEXT[],
    reference_id VARCHAR(50) UNIQUE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_found_items_user_id ON found_items(user_id);
CREATE INDEX IF NOT EXISTS idx_found_items_status ON found_items(status);
CREATE INDEX IF NOT EXISTS idx_found_items_category ON found_items(category);
CREATE INDEX IF NOT EXISTS idx_found_items_reference_id ON found_items(reference_id);

CREATE INDEX IF NOT EXISTS idx_found_items_created_at ON found_items(created_at DESC);