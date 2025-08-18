import { createClient } from '@supabase/supabase-js'
import axios from 'axios'
import * as cheerio from 'cheerio'

async function scrapeRanking() {
  const url = 'https://apps.apple.com/us/app/coinbase-buy-btc-eth-sol/id886427730'
  
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1'
    },
    timeout: 30000
  })

  const $ = cheerio.load(response.data)
  
  // Extract ranking
  const rankingElement = $('a[href*="charts"]')
  const rankingText = rankingElement.text().trim()
  const rankingMatch = rankingText.match(/#(\d+)\s+in/)
  const ranking = rankingMatch ? parseInt(rankingMatch[1]) : null

  // Extract rating and rating count
  const ratingElement = $('.we-rating-count')
  const ratingText = ratingElement.text().trim()
  const ratingMatch = ratingText.match(/([\d.]+)\s*•\s*(.+)/)
  
  const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null
  const ratingCount = ratingMatch ? ratingMatch[2] : null

  return {
    ranking,
    rating,
    ratingCount,
    scrapedAt: new Date().toISOString()
  }
}

export async function POST() {
  try {
    // Create Supabase client directly in the function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing Supabase configuration',
          details: 'Environment variables not set'
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Scrape the data
    const scrapedData = await scrapeRanking()
    
    if (!scrapedData.ranking) {
      return new Response(
        JSON.stringify({ 
          error: 'Failed to extract ranking from App Store page',
          details: 'Could not find ranking information'
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Save to database
    const { data, error } = await supabase
      .from('coinbase_rankings')
      .insert({
        ranking: scrapedData.ranking,
        rating: scrapedData.rating,
        rating_count: scrapedData.ratingCount,
        scraped_at: scrapedData.scrapedAt
      })
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to save ranking', 
          details: error.message 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          ranking: data.ranking,
          rating: data.rating,
          ratingCount: data.rating_count,
          scrapedAt: data.scraped_at
        },
        message: 'Ranking scraped and saved successfully'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
    
  } catch (error) {
    console.error('Scraping API error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to scrape ranking', 
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({
      message: 'Use POST method to trigger a manual scrape',
      endpoints: {
        'POST /api/scrape': 'Trigger manual scrape',
        'GET /api/rankings': 'Get ranking data'
      }
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}