-- Drop lost items related tables and data
-- This will remove all lost item data and related matches

-- Drop indexes first
DROP INDEX IF EXISTS idx_lost_items_embedding;
DROP INDEX IF EXISTS idx_lost_items_status;

-- Drop matches that reference lost items
DELETE FROM matches WHERE lost_item_id IS NOT NULL;

-- Drop the lost_items table
DROP TABLE IF EXISTS lost_items CASCADE;