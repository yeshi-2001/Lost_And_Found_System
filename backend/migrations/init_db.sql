-- Enable pgvector extension for vector similarity search
-- This is required for AI-powered item matching
CREATE EXTENSION IF NOT EXISTS vector;

-- Create users table
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

-- Create found_items table
CREATE TABLE IF NOT EXISTS found_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    brand VARCHAR(100),
    color VARCHAR(50),
    location VARCHAR(255),
    found_date DATE,
    image_urls TEXT[],
    embedding VECTOR(384),  -- CHANGED: 384 dimensions for sentence-transformers (was 1536 for OpenAI)
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create lost_items table
CREATE TABLE IF NOT EXISTS lost_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    brand VARCHAR(100),
    color VARCHAR(50),
    last_seen_location VARCHAR(255),
    lost_date DATE,
    image_urls TEXT[],
    embedding VECTOR(384),  -- CHANGED: 384 dimensions for sentence-transformers (was 1536 for OpenAI)
    status VARCHAR(50) DEFAULT 'searching',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    found_item_id INTEGER REFERENCES found_items(id) ON DELETE CASCADE,
    lost_item_id INTEGER REFERENCES lost_items(id) ON DELETE CASCADE,
    similarity_score FLOAT,
    verification_questions JSONB,
    verification_answers JSONB,
    ai_confidence_score FLOAT,
    contact_shared BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    verified_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_found_items_embedding ON found_items USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_lost_items_embedding ON lost_items USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_found_items_status ON found_items(status);
CREATE INDEX IF NOT EXISTS idx_lost_items_status ON lost_items(status);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);