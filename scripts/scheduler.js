// DEPRECATED: This scheduler is no longer used
// Apple has restricted desktop access to App Store rankings
// Manual entry is now used instead via the web UI
//
// See: Manual entry form at /components/ManualEntryForm.js
// Last updated: 2025-11-07

/*
// Load environment variables from .env.local
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import cron from 'node-cron'
import { scrapeAndSave } from '../lib/scraper.js'

console.log('🚀 Coinbase Ranking Scheduler Started')
console.log('📅 Scheduled to run every hour at minute 0')
*/

console.log('⚠️  This scheduler has been deprecated.')
console.log('📱 Please use the manual entry form in the web UI to add rankings.')
console.log('   Rankings can only be viewed on iOS/iPadOS App Store app.')
process.exit(0)

/*
// Schedule the task to run every hour at minute 0
// Cron format: minute(0-59) hour(0-23) day(1-31) month(1-12) weekday(0-7)
cron.schedule('0 * * * *', async () => {
  const timestamp = new Date().toISOString()
  console.log(`\n⏰ [${timestamp}] Starting scheduled scraping...`)
  
  try {
    const result = await scrapeAndSave()
    console.log(`✅ [${timestamp}] Successfully scraped and saved ranking:`, {
      ranking: result.ranking,
      rating: result.rating,
      id: result.id
    })
  } catch (error) {
    console.error(`❌ [${timestamp}] Error during scheduled scraping:`, error.message)
  }
}, {
  scheduled: true,
  timezone: "America/New_York" // Adjust timezone as needed
})

// Also run immediately when the script starts
console.log('🔄 Running initial scrape...')
scrapeAndSave()
  .then((result) => {
    console.log('✅ Initial scrape completed:', {
      ranking: result.ranking,
      rating: result.rating,
      id: result.id
    })
  })
  .catch((error) => {
    console.error('❌ Initial scrape failed:', error.message)
  })

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n👋 Scheduler stopped gracefully')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n👋 Scheduler terminated gracefully')
  process.exit(0)
})

console.log('⚡ Scheduler is running. Press Ctrl+C to stop.')
*/'
