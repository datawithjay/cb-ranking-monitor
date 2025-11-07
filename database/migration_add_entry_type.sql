-- Migration: Add entry_type column to differentiate manual vs scraped entries
-- This allows us to track how each data point was collected

-- Add entry_type column with default 'scraped' for existing data
ALTER TABLE coinbase_rankings 
ADD COLUMN IF NOT EXISTS entry_type TEXT DEFAULT 'scraped';

-- Add a check constraint to ensure entry_type is either 'manual' or 'scraped'
ALTER TABLE coinbase_rankings 
ADD CONSTRAINT check_entry_type CHECK (
  entry_type IN ('manual', 'scraped')
);

-- Create an index on entry_type for filtering
CREATE INDEX IF NOT EXISTS idx_coinbase_rankings_entry_type ON coinbase_rankings(entry_type);

-- Update any existing NULL values to 'scraped' (in case some exist)
UPDATE coinbase_rankings 
SET entry_type = 'scraped' 
WHERE entry_type IS NULL;

-- Add comment to document the column
COMMENT ON COLUMN coinbase_rankings.entry_type IS 'Type of entry: manual (user input) or scraped (automated)';

