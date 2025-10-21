-- Add verification fields to matches table for AI-generated questions
ALTER TABLE matches ADD COLUMN IF NOT EXISTS verification_questions JSONB;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS verification_answers JSONB;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS verification_score DECIMAL(5,2);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS verification_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS verification_explanation TEXT;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS verification_generated_at TIMESTAMP;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS verification_completed_at TIMESTAMP;