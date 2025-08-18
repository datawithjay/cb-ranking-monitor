# 🚀 Deployment & Scheduler Setup Guide

## Current Status
- ⚠️ **Scheduler requires manual start**: `npm run scheduler`
- ✅ **Dashboard runs independently**: `npm run dev`

## 🛠️ Setup Options for Always-Running Scheduler

### Option 1: PM2 Process Manager (Recommended for VPS/Local)

```bash
# Install PM2 globally
npm install -g pm2

# Start the scheduler with PM2
pm2 start ecosystem.config.js

# Monitor processes
pm2 status
pm2 logs coinbase-scheduler

# Auto-start on system boot
pm2 startup
pm2 save

# Stop the scheduler
pm2 stop coinbase-scheduler
pm2 delete coinbase-scheduler
```

**✅ Pros:** Simple, robust, great for VPS/dedicated servers
**❌ Cons:** Requires a server that stays on 24/7

---

### Option 2: Docker Container

```bash
# Build and run with Docker Compose
docker-compose up -d scheduler

# View logs
docker-compose logs -f scheduler

# Stop the container
docker-compose down
```

**✅ Pros:** Isolated, portable, easy to deploy anywhere
**❌ Cons:** Requires Docker knowledge, server still needs to stay on

---

### Option 3: Cloud Serverless (Recommended for Production)

#### 3A. Vercel Cron (Free tier available)

1. Deploy your Next.js app to Vercel
2. Add this to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/scheduled-scrape",
      "schedule": "0 * * * *"
    }
  ]
}
```

3. Add `CRON_SECRET` to your environment variables

#### 3B. GitHub Actions (Free)

Create `.github/workflows/scraper.yml`:

```yaml
name: Hourly Scraping
on:
  schedule:
    - cron: '0 * * * *'  # Every hour
  workflow_dispatch:  # Manual trigger

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: node scripts/scraper.js
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

#### 3C. External Cron Services

Use services like:
- **Cron-job.org** (free)
- **EasyCron** 
- **UptimeRobot**

Make HTTP POST requests to: `https://your-app.vercel.app/api/scheduled-scrape`

**✅ Pros:** No server maintenance, free/cheap, highly reliable
**❌ Cons:** Slightly more complex setup

---

### Option 4: Cloud Platform Background Workers

#### Railway.app
```bash
# Deploy with automatic scheduling
railway login
railway link
railway up
# Add scheduler as a service in Railway dashboard
```

#### Render.com Background Service
- Create a new "Background Worker" service
- Set start command: `node scripts/scheduler.js`
- Deploy from GitHub

**✅ Pros:** Managed infrastructure, auto-scaling
**❌ Cons:** Costs money for 24/7 running

---

## 🎯 Quick Start Options

### For Development/Testing:
```bash
# Terminal 1: Run the dashboard
npm run dev

# Terminal 2: Run the scheduler
npm run scheduler
```

### For Production (Recommended):
1. **Deploy dashboard to Vercel** (free)
2. **Use GitHub Actions for scraping** (free)
3. **Or use Vercel Cron** (free tier)

### For Self-Hosted:
```bash
# Install PM2 and start both services
npm install -g pm2
pm2 start ecosystem.config.js
pm2 start "npm run dev" --name "dashboard"
```

## 🔐 Environment Variables Needed

For all deployment options, ensure these are set:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CRON_SECRET=your_secret_for_auth (for serverless)
```

## 📊 Monitoring

- **PM2**: `pm2 monit`
- **Docker**: `docker-compose logs -f`
- **Vercel**: Function logs in dashboard
- **Railway/Render**: Built-in logging

Choose the option that best fits your technical comfort level and infrastructure preferences!
