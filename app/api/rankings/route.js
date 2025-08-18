import { createClient } from '@supabase/supabase-js'

export async function GET(request) {
  try {
    // Create Supabase client directly in the function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
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
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const days = parseInt(searchParams.get('days') || '30')
    
    // Calculate the date filter
    const daysAgo = new Date()
    daysAgo.setDate(daysAgo.getDate() - days)
    
    const { data, error } = await supabase
      .from('coinbase_rankings')
      .select('*')
      .gte('scraped_at', daysAgo.toISOString())
      .order('scraped_at', { ascending: true })
      .limit(limit)
    
    if (error) {
      console.error('Supabase error:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch rankings', 
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
        data: data || [],
        count: data?.length || 0,
        meta: {
          limit,
          days,
          oldestRecord: data?.[0]?.scraped_at || null,
          newestRecord: data?.[data.length - 1]?.scraped_at || null
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
    
  } catch (error) {
    console.error('API Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export async function POST(request) {
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
    
    const body = await request.json()
    const { ranking, rating, rating_count } = body
    
    if (!ranking) {
      return new Response(
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
        data
      }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    )
    
  } catch (error) {
    console.error('API error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}