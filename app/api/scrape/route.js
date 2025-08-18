import { NextResponse } from 'next/server'
import { scrapeAndSave } from '../../../lib/scraper'

export async function POST(request) {
  try {
    // Optional: Add authentication check here
    const result = await scrapeAndSave()
    
    return new NextResponse(
      JSON.stringify({
        success: true,
        data: result,
        message: 'Ranking scraped and saved successfully'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
    
  } catch (error) {
    console.error('Scraping API error:', error)
    return new NextResponse(
      JSON.stringify({ 
        success: false,
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
  return new NextResponse(
    JSON.stringify({
      message: 'Use POST method to trigger a manual scrape',
      endpoints: {
        POST: '/api/scrape - Trigger manual scrape',
        GET: '/api/rankings - Get ranking data'
      }
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}
