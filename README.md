# Coinbase App Store Ranking Monitor

A web application that monitors Coinbase's ranking in the Apple App Store Finance category every hour and visualizes the data over time using interactive charts.

## Features

- **Automated Monitoring**: Scrapes Coinbase's App Store ranking every hour
- **Data Storage**: Stores historical ranking data in Supabase database
- **Interactive Dashboard**: Beautiful charts showing ranking trends over time
- **Real-time Stats**: Current ranking, best/worst rankings, and recent changes
- **Manual Controls**: Trigger manual scrapes and refresh data
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Database**: Supabase (PostgreSQL)
- **Scraping**: Axios + Cheerio
- **Scheduling**: Node-cron
- **Deployment**: Vercel-ready

## Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Git

### 2. Clone and Install

```bash
git clone <your-repo-url>
cd CB-Ranking
npm install
```

### 3. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL from `database/schema.sql` in your Supabase SQL editor
3. Get your project URL and API keys from Project Settings > API

### 4. Environment Variables

1. Copy the environment template:
```bash
cp env.example .env.local
```

2. Fill in your Supabase credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SCRAPING_ENABLED=true
```

### 5. Run the Application

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:3000
```

### 6. Test the Scraper

```bash
# Test a single scrape
npm run scrape

# Start the hourly scheduler (in production)
npm run scheduler
```

## Usage

### Web Dashboard

- Visit `http://localhost:3000` to view the dashboard
- Use time range buttons (6h, 24h, 7d, 30d) to filter the chart
- Click "Manual Scrape" to trigger an immediate ranking check
- Click "Refresh" to reload the latest data

### API Endpoints

- `GET /api/rankings` - Fetch ranking data
  - Query params: `limit` (default: 100), `days` (default: 30)
- `POST /api/scrape` - Trigger manual scrape

### Automated Scheduling

The scheduler runs continuously and scrapes every hour:

```bash
npm run scheduler
```

For production, use a process manager like PM2:

```bash
npm install -g pm2
pm2 start "npm run scheduler" --name coinbase-scraper
```

## Database Schema

The `coinbase_rankings` table stores:

- `id`: Primary key
- `ranking`: App Store position (integer)
- `rating`: User rating (decimal)
- `rating_count`: Number of ratings (text)
- `scraped_at`: When the data was collected
- `created_at`: Record creation time

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

For the scheduler, deploy separately (e.g., Railway, Render, or VPS).

### Railway/Render

Deploy the scheduler as a separate service:

1. Create a new service
2. Connect your repository
3. Set start command to `npm run scheduler`
4. Add environment variables

## Configuration

### Scraping Settings

Modify `lib/scraper.js` to adjust:
- Request headers
- Timeout settings
- Retry logic
- Data extraction logic

### Chart Settings

Customize `components/RankingChart.js` for:
- Chart colors and styling
- Time range options
- Tooltip formatting
- Scale configurations

### Scheduling

Edit `scripts/scheduler.js` to change:
- Scraping frequency (default: every hour)
- Timezone settings
- Error handling

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check your `.env.local` file
   - Ensure all required variables are set

2. **Scraping fails with 403/blocked**
   - App Store may be blocking requests
   - Try adjusting headers in `lib/scraper.js`
   - Consider using a proxy service

3. **No data showing in charts**
   - Check database connection
   - Run manual scrape: `npm run scrape`
   - Check browser console for errors

4. **Chart not rendering**
   - Ensure Chart.js dependencies are installed
   - Check for JavaScript errors in console

### Debug Mode

Enable detailed logging by setting:
```env
NODE_ENV=development
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Monitoring Coinbase

This app specifically tracks:
- **App**: Coinbase: Buy BTC, ETH, SOL
- **App Store ID**: 886427730
- **Category**: Finance
- **URL**: https://apps.apple.com/us/app/coinbase-buy-btc-eth-sol/id886427730

The ranking represents Coinbase's position in the Finance category of the iOS App Store in the United States.
