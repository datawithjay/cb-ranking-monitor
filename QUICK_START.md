# Quick Start Guide - Manual Entry System

## 🚀 Getting Started (3 Steps)

### Step 1: Apply Database Migration

**Go to your Supabase Dashboard:**
1. Visit https://supabase.com/dashboard
2. Select your Coinbase project
3. Go to **SQL Editor**
4. Run this query:

```sql
-- Add entry_type column to track manual vs scraped entries
ALTER TABLE coinbase_rankings 
ADD COLUMN IF NOT EXISTS entry_type TEXT DEFAULT 'scraped';

ALTER TABLE coinbase_rankings 
ADD CONSTRAINT check_entry_type CHECK (
  entry_type IN ('manual', 'scraped')
);

CREATE INDEX IF NOT EXISTS idx_coinbase_rankings_entry_type ON coinbase_rankings(entry_type);

UPDATE coinbase_rankings 
SET entry_type = 'scraped' 
WHERE entry_type IS NULL;
```

### Step 2: Disable GitHub Actions (If Applicable)

If you have a GitHub Actions workflow for hourly scraping:

1. Go to your GitHub repository
2. Click **"Actions"** tab
3. Find the scraping workflow
4. Click **"..."** → **"Disable workflow"**

OR delete/rename the workflow file in `.github/workflows/`

### Step 3: Deploy Your Changes

```bash
cd "/Users/jasoncassera/Cursor Projects/Crptools/CB Ranking"
git add .
git commit -m "Add manual entry system for App Store rankings"
git push
```

Your hosting platform (Vercel, Heroku, etc.) will automatically deploy.

---

## 📱 How to Use

### Finding the Ranking

**On your iPhone or iPad:**

1. Open the **App Store** app
2. Search for **"Coinbase"**
3. Tap on the app
4. Scroll down to **"Chart Position"** section
5. Look for: **"#XX in Finance"** (e.g., "#25 in Finance")

### Entering Data

**On your webapp:**

1. Open your deployed website
2. Find the **"📝 Manual Entry"** form at the top
3. Enter the ranking number (e.g., **25**)
4. Optionally enter rating (e.g., **4.7**)
5. Optionally enter rating count (e.g., **1.8M Ratings**)
6. Click **"💾 Save Entry"**

### Viewing Results

- Click **"🔄 Refresh"** if the chart doesn't update
- Your entry appears immediately on the chart
- All entries are timestamped automatically

---

## ✅ Verification Checklist

After completing the steps above, verify:

- [ ] Database migration applied successfully (no errors in Supabase)
- [ ] GitHub Actions workflow disabled (if applicable)
- [ ] Changes deployed to your hosting platform
- [ ] Website loads without errors
- [ ] Manual entry form is visible at the top
- [ ] You can submit a test entry
- [ ] Chart displays your test entry
- [ ] Refresh button works

---

## 🧪 Local Testing

To test locally before deploying:

```bash
# Start the dev server
npm run dev

# Open in browser
# http://localhost:3000
```

Make sure your `.env.local` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 📊 What Changed

**Before:**
- ❌ Automated hourly scraping (broken due to Apple restrictions)
- ❌ GitHub Actions running and failing
- ❌ Errors in logs

**After:**
- ✅ Clean manual entry form
- ✅ Mobile-friendly workflow (check on phone, enter on computer)
- ✅ No more failed jobs or errors
- ✅ Same beautiful charts and analytics

---

## 🆘 Troubleshooting

### "Failed to save entry" error
- Check `.env.local` has `SUPABASE_SERVICE_ROLE_KEY`
- Verify the database migration ran successfully
- Check browser console for detailed errors

### Can't find ranking on iPhone
- Must use the iOS **App Store app** (not Safari)
- Scroll past reviews to "Chart Position"
- Some apps don't show ranking every day (that's normal)

### Chart not updating
- Click the "🔄 Refresh" button
- Check that you saw the success message
- Clear browser cache and reload

### Deploy failed
- Check your hosting platform logs
- Ensure all environment variables are set
- Try redeploying manually

---

## 📞 Need Help?

- Check `MANUAL_ENTRY_UPDATE.md` for detailed documentation
- See `database/migration_add_entry_type.sql` for the migration file
- Review error logs in your browser console or hosting platform

---

## 🎉 You're Done!

Your app now supports manual entry. Enter rankings as often as you like:
- Daily for detailed tracking
- Weekly for trends
- Whenever you remember!

The system is flexible and works on your schedule.

