#!/usr/bin/env node

// Simple test script for the scraper functionality
import { scrapeRanking } from '../lib/scraper.js'

console.log('🧪 Testing Coinbase App Store Scraper...\n')

async function testScraper() {
  try {
    console.log('📡 Attempting to scrape Coinbase App Store page...')
    
    const result = await scrapeRanking()
    
    console.log('✅ Scraping successful!')
    console.log('📊 Results:')
    console.log(`   Ranking: ${result.ranking ? `#${result.ranking}` : 'Not found'}`)
    console.log(`   Rating: ${result.rating ? `${result.rating}⭐` : 'Not found'}`)
    console.log(`   Rating Count: ${result.ratingCount || 'Not found'}`)
    console.log(`   Scraped At: ${result.scrapedAt}`)
    
    // Validate results
    if (result.ranking && result.ranking > 0 && result.ranking <= 1000) {
      console.log('\n✅ Ranking validation: PASSED (valid range)')
    } else {
      console.log('\n⚠️  Ranking validation: WARNING (ranking not in expected range or null)')
    }
    
    if (result.rating && result.rating >= 1 && result.rating <= 5) {
      console.log('✅ Rating validation: PASSED (valid range)')
    } else {
      console.log('⚠️  Rating validation: WARNING (rating not in expected range or null)')
    }
    
    console.log('\n🎉 Test completed successfully!')
    
  } catch (error) {
    console.error('❌ Test failed!')
    console.error('Error details:', error.message)
    console.error('Stack trace:', error.stack)
    process.exit(1)
  }
}

testScraper()
