-- Create the coinbase_rankings table
CREATE TABLE IF NOT EXISTS coinbase_rankings (
    id BIGSERIAL PRIMARY KEY,
    ranking INTEGER NOT NULL,
    rating DECIMAL(3,1),
    rating_count TEXT,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on scraped_at for faster queries
CREATE INDEX IF NOT EXISTS idx_coinbase_rankings_scraped_at ON coinbase_rankings(scraped_at);

-- Create an index on ranking for analytics
CREATE INDEX IF NOT EXISTS idx_coinbase_rankings_ranking ON coinbase_rankings(ranking);

-- Add Row Level Security (RLS)
ALTER TABLE coinbase_rankings ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows read access to all users
CREATE POLICY "Allow read access to coinbase_rankings" ON coinbase_rankings
    FOR SELECT USING (true);

-- Create a policy that allows insert for authenticated users (or service role)
CREATE POLICY "Allow insert for service role" ON coinbase_rankings
    FOR INSERT WITH CHECK (true);

-- Grant necessary permissions
GRANT SELECT ON coinbase_rankings TO anon;
GRANT SELECT ON coinbase_rankings TO authenticated;
GRANT ALL ON coinbase_rankings TO service_role;
