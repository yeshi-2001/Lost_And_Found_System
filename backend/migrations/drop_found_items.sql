-- Drop found items related tables and data
-- This will remove all found item data and related matches

-- Drop indexes first
DROP INDEX IF EXISTS idx_found_items_embedding;
DROP INDEX IF EXISTS idx_found_items_status;

-- Drop matches that reference found items
DELETE FROM matches WHERE found_item_id IS NOT NULL;

-- Drop the found_items table
DROP TABLE IF EXISTS found_items CASCADE;