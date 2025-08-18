import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '100'
    const days = searchParams.get('days') || '30'
    
    // Calculate the date filter
    const daysAgo = new Date()
    daysAgo.setDate(daysAgo.getDate() - parseInt(days))
    
    const { data, error } = await supabase
      .from('coinbase_rankings')
      .select('*')
      .gte('scraped_at', daysAgo.toISOString())
      .order('scraped_at', { ascending: true })
      .limit(parseInt(limit))
    
    if (error) {
      console.error('Supabase error:', error)
      return new NextResponse(
        JSON.stringify({ error: 'Failed to fetch rankings', details: error.message }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    return new NextResponse(
      JSON.stringify({
        success: true,
        data,
        count: data.length,
        meta: {
          limit: parseInt(limit),
          days: parseInt(days),
          oldestRecord: data.length > 0 ? data[0].scraped_at : null,
          newestRecord: data.length > 0 ? data[data.length - 1].scraped_at : null
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
    
  } catch (error) {
    console.error('API error:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { ranking, rating, rating_count } = body
    
    if (!ranking) {
      return new NextResponse(
        JSON.stringify({ error: 'Ranking is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    const { data, error } = await supabase
      .from('coinbase_rankings')
      .insert({
        ranking: parseInt(ranking),
        rating: rating ? parseFloat(rating) : null,
        rating_count: rating_count || null,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      return new NextResponse(
        JSON.stringify({ error: 'Failed to save ranking', details: error.message }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    return new NextResponse(
      JSON.stringify({
        success: true,
        data
      }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    )
    
  } catch (error) {
    console.error('API error:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
