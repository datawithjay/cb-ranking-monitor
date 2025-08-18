#!/usr/bin/env node

// Load environment variables from .env.local
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

// One-time scraper script for manual testing
import { scrapeAndSave } from '../lib/scraper.js'

console.log('🔍 Running manual scrape of Coinbase App Store ranking...')

scrapeAndSave()
  .then((result) => {
    console.log('✅ Scraping completed successfully!')
    console.log('📊 Results:', {
      id: result.id,
      ranking: result.ranking,
      rating: result.rating,
      ratingCount: result.rating_count,
      scrapedAt: result.scraped_at
    })
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Scraping failed:', error.message)
    console.error('Stack trace:', error.stack)
    process.exit(1)
  })
