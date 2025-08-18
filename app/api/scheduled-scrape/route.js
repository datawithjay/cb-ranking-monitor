// Vercel Serverless Function for scheduled scraping
// This is triggered automatically by Vercel Cron

import { scrapeAndSave } from '../../../lib/scraper.js'

export async function POST(req) {
  try {
    // Verify the request is from Vercel Cron (optional auth)
    const authToken = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    // Allow both Vercel's internal calls and manual POST requests with auth
    if (cronSecret && authToken !== `Bearer ${cronSecret}`) {
      // For Vercel Cron, the request comes from Vercel's internal system
      // Allow requests without auth header if no CRON_SECRET is set
      if (req.headers.get('x-vercel-cron') !== '1' && cronSecret) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    const timestamp = new Date().toISOString()
    console.log(`⏰ [${timestamp}] Starting scheduled scraping...`)
    
    const result = await scrapeAndSave()
    
    console.log(`✅ [${timestamp}] Successfully scraped and saved ranking:`, {
      ranking: result.ranking,
      rating: result.rating,
      id: result.id
    })

    return new Response(JSON.stringify({
      success: true,
      timestamp,
      data: {
        ranking: result.ranking,
        rating: result.rating,
        id: result.id
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error(`❌ Error during scheduled scraping:`, error.message)
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Allow GET requests for manual testing
export async function GET() {
  return new Response(JSON.stringify({
    message: 'Coinbase Scheduler Endpoint',
    usage: 'POST to trigger manual scrape',
    schedule: 'Runs automatically every hour via Vercel Cron'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
