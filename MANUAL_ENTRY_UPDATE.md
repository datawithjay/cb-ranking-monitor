# Manual Entry System - Update Documentation

## Overview
The system has been updated from automated scraping to manual entry due to Apple restricting desktop access to App Store rankings. Rankings are now only viewable through the iOS/iPadOS App Store app.

## Changes Made

### 1. New Manual Entry Form
**File:** `components/ManualEntryForm.js`
- Clean, user-friendly form for entering rankings
- Fields for ranking (required), rating (optional), and rating count (optional)
- Real-time validation
- Clear instructions on how to find rankings on iOS devices
- Automatic timestamp on submission

### 2. New API Endpoint
**File:** `pages/api/manual-entry.js`
- POST endpoint for submitting manual entries
- Validates ranking data before saving
- Adds `entry_type: 'manual'` to differentiate from scraped data
- Uses Supabase service role for write access

### 3. Database Schema Update
**File:** `database/migration_add_entry_type.sql`
- Adds `entry_type` column to track manual vs scraped entries
- Includes check constraint to ensure valid values ('manual' or 'scraped')
- Defaults to 'scraped' for backwards compatibility
- Indexed for efficient filtering

### 4. Updated Main Page
**File:** `app/page.js`
- Removed "Manual Scrape" button
- Added `ManualEntryForm` component at the top
- Updated "About This Monitor" section to reflect manual entry
- Refresh button remains for updating the chart

### 5. Deprecated Scheduler
**File:** `scripts/scheduler.js`
- Completely disabled with deprecation notice
- All code commented out
- Exits immediately if run

**File:** `Procfile`
- Scheduler process commented out

## What You Need to Do

### Step 1: Apply Database Migration

Run this SQL in your Supabase dashboard (SQL Editor):

```sql
-- Add entry_type column
ALTER TABLE coinbase_rankings 
ADD COLUMN IF NOT EXISTS entry_type TEXT DEFAULT 'scraped';

-- Add check constraint
ALTER TABLE coinbase_rankings 
ADD CONSTRAINT check_entry_type CHECK (
  entry_type IN ('manual', 'scraped')
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_coinbase_rankings_entry_type ON coinbase_rankings(entry_type);

-- Update any existing NULL values
UPDATE coinbase_rankings 
SET entry_type = 'scraped' 
WHERE entry_type IS NULL;

-- Add comment
COMMENT ON COLUMN coinbase_rankings.entry_type IS 'Type of entry: manual (user input) or scraped (automated)';
```

### Step 2: Disable GitHub Actions Workflow

If you have a GitHub Actions workflow running hourly scrapes, you need to disable it:

**Option A: Disable the workflow**
1. Go to your GitHub repository
2. Click on "Actions" tab
3. Find the scraping workflow
4. Click on the workflow name
5. Click the "..." menu in the top right
6. Select "Disable workflow"

**Option B: Delete or rename the workflow file**
1. In your repository, go to `.github/workflows/`
2. Find the workflow file (likely named something like `scrape.yml` or `hourly-scrape.yml`)
3. Either delete it or rename it to `scrape.yml.disabled`
4. Commit and push the change

### Step 3: Deploy the Changes

Deploy your updated code to your hosting platform (Vercel, Heroku, Railway, etc.):

```bash
git add .
git commit -m "Switch from automated scraping to manual entry"
git push
```

### Step 4: Test the Manual Entry

1. Open your deployed webapp
2. You should see the "Manual Entry" form at the top
3. On your iPhone or iPad:
   - Open the App Store
   - Search for "Coinbase"
   - Scroll down to "Chart Position"
   - Note the ranking in Finance category
4. Enter the ranking in the form
5. Click "Save Entry"
6. Verify the chart updates with your new data point

## How to Use the Manual Entry System

### Finding the Ranking (iOS/iPadOS)
1. Open the **App Store** app
2. Search for **"Coinbase"**
3. Tap on the Coinbase app
4. Scroll down to **"Chart Position"**
5. Look for the Finance category ranking (e.g., "#25 in Finance")

### Entering Data
1. Enter the ranking number (e.g., 25)
2. Optionally enter the star rating (e.g., 4.7)
3. Optionally enter the number of ratings (e.g., "1.8M Ratings")
4. Click **"Save Entry"**

### Viewing Data
- The chart will automatically include your manual entries
- Manual entries are timestamped when you submit them
- All historical data (both scraped and manual) remains visible

## Database Schema

### Updated Schema
```sql
CREATE TABLE coinbase_rankings (
    id BIGSERIAL PRIMARY KEY,
    ranking INTEGER NOT NULL,
    rating DECIMAL(3,1),
    rating_count TEXT,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    entry_type TEXT DEFAULT 'scraped' CHECK (entry_type IN ('manual', 'scraped'))
);
```

### Entry Types
- `'scraped'` - Automated entries (historical data)
- `'manual'` - Manually entered via the web form (new entries)

## Files Modified
- ✅ `components/ManualEntryForm.js` - New manual entry form
- ✅ `pages/api/manual-entry.js` - New API endpoint
- ✅ `app/page.js` - Updated to use manual entry
- ✅ `scripts/scheduler.js` - Deprecated
- ✅ `Procfile` - Scheduler commented out
- ✅ `database/migration_add_entry_type.sql` - Schema migration

## Files to Keep (Unchanged)
- `components/RankingChart.js` - Still works with manual entries
- `components/StatsCards.js` - Still works with manual entries
- `pages/api/rankings.js` - Still used to fetch data
- `lib/scraper.js` - Kept for reference (not used)

## Benefits of Manual Entry

1. **Reliable** - No breaking when Apple changes their website
2. **Accurate** - You see exactly what's in the App Store
3. **Simple** - No complex scraping logic to maintain
4. **Flexible** - Enter data as frequently or infrequently as needed
5. **Timestamped** - Every entry has your exact submission time

## Troubleshooting

### Entry Won't Save
- Check that ranking is a positive number
- Check that rating is between 0-5 (if provided)
- Check browser console for errors
- Verify Supabase credentials are set

### Chart Not Updating
- Click the "Refresh" button
- Check that the entry was saved (look for success message)
- Verify your Supabase connection

### Can't Find Ranking on iPhone
- Make sure you're using the iOS App Store app (not website)
- Scroll down past reviews to "Chart Position"
- If no ranking shown, the app may not be ranked that day

## Future Improvements

Potential enhancements:
- Toast notifications instead of alerts
- History of your manual entries
- Reminder notifications to enter data
- Mobile-optimized view for easier data entry on phone
- Bulk entry for multiple data points

