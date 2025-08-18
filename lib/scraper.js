import axios from 'axios'
import * as cheerio from 'cheerio'
import { supabaseAdmin } from './supabase.js'

const COINBASE_APP_URL = 'https://apps.apple.com/us/app/coinbase-buy-btc-eth-sol/id886427730'

// Headers to mimic a real browser request
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
}

/**
 * Extracts ranking information from the App Store page
 * @param {string} html - The HTML content of the page
 * @returns {Object} - Extracted data containing ranking, rating, and rating count
 */
function extractRankingData(html) {
  const $ = cheerio.load(html)
  
  // Extract ranking from the specified HTML structure
  const rankingElement = $('a[href*="charts"]')
  const rankingText = rankingElement.text().trim()
  
  let ranking = null
  if (rankingText) {
    // Extract number from text like "#20 in Finance"
    const match = rankingText.match(/#(\d+)/)
    if (match) {
      ranking = parseInt(match[1], 10)
    }
  }
  
  // Extract rating
  const ratingElement = $('.we-rating-count')
  const ratingText = ratingElement.text().trim()
  
  let rating = null
  let ratingCount = null
  
  if (ratingText) {
    // Parse text like "4.7 • 1.8M Ratings"
    const ratingMatch = ratingText.match(/^([\d.]+)/)
    if (ratingMatch) {
      rating = parseFloat(ratingMatch[1])
    }
    
    // Extract rating count
    const countMatch = ratingText.match(/•\s*(.+)/)
    if (countMatch) {
      ratingCount = countMatch[1].trim()
    }
  }
  
  return {
    ranking,
    rating,
    ratingCount,
    scrapedAt: new Date().toISOString()
  }
}

/**
 * Scrapes the Coinbase App Store page and extracts ranking data
 * @returns {Promise<Object>} - The extracted ranking data
 */
export async function scrapeRanking() {
  try {
    console.log('Starting to scrape Coinbase App Store ranking...')
    
    const response = await axios.get(COINBASE_APP_URL, {
      headers: HEADERS,
      timeout: 30000, // 30 second timeout
    })
    
    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: Failed to fetch the page`)
    }
    
    const data = extractRankingData(response.data)
    
    console.log('Scraped data:', data)
    
    if (data.ranking === null) {
      console.warn('Warning: Could not extract ranking from the page')
    }
    
    return data
  } catch (error) {
    console.error('Error scraping ranking:', error.message)
    throw error
  }
}

/**
 * Saves ranking data to Supabase database
 * @param {Object} data - The ranking data to save
 * @returns {Promise<Object>} - The saved record
 */
export async function saveRankingData(data) {
  try {
    const { data: result, error } = await supabaseAdmin
      .from('coinbase_rankings')
      .insert({
        ranking: data.ranking,
        rating: data.rating,
        rating_count: data.ratingCount,
        scraped_at: data.scrapedAt
      })
      .select()
      .single()
    
    if (error) {
      throw error
    }
    
    console.log('Successfully saved ranking data:', result)
    return result
  } catch (error) {
    console.error('Error saving ranking data:', error)
    throw error
  }
}

/**
 * Main function to scrape and save ranking data
 * @returns {Promise<Object>} - The saved ranking data
 */
export async function scrapeAndSave() {
  try {
    const data = await scrapeRanking()
    const savedData = await saveRankingData(data)
    return savedData
  } catch (error) {
    console.error('Error in scrapeAndSave:', error)
    throw error
  }
}
