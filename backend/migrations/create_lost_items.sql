-- Drop existing lost_items table if it exists
DROP TABLE IF EXISTS lost_items CASCADE;

-- Create lost_items table with all required fields
CREATE TABLE lost_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    color VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    date_lost DATE NOT NULL,
    description TEXT NOT NULL,
    additional_info TEXT,
    image_urls TEXT[],
    reference_id VARCHAR(50) UNIQUE,
    status VARCHAR(50) DEFAULT 'searching',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lost_items_user_id ON lost_items(user_id);
CREATE INDEX IF NOT EXISTS idx_lost_items_status ON lost_items(status);
CREATE INDEX IF NOT EXISTS idx_lost_items_category ON lost_items(category);
CREATE INDEX IF NOT EXISTS idx_lost_items_reference_id ON lost_items(reference_id);
CREATE INDEX IF NOT EXISTS idx_lost_items_created_at ON lost_items(created_at DESC);