import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Create Supabase client directly in the function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ 
        error: 'Missing Supabase configuration',
        details: 'Environment variables not set',
        env: {
          url: supabaseUrl ? 'SET' : 'MISSING',
          key: supabaseKey ? 'SET' : 'MISSING'
        }
      })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { limit = '1000', days = '30' } = req.query
    
    // Calculate the date filter
    const daysAgo = new Date()
    daysAgo.setDate(daysAgo.getDate() - parseInt(days))
    
    // Get data in descending order first (newest first), then reverse
    const { data: rawData, error } = await supabase
      .from('coinbase_rankings')
      .select('*')
      .gte('scraped_at', daysAgo.toISOString())
      .order('scraped_at', { ascending: false })
      .limit(parseInt(limit))
    
    // Reverse to get chronological order (oldest first) for the chart
    const data = rawData ? rawData.reverse() : []
    
    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ 
        error: 'Failed to fetch rankings', 
        details: error.message 
      })
    }
    
    return res.status(200).json({
      success: true,
      data: data || [],
      count: data?.length || 0,
      meta: {
        limit: parseInt(limit),
        days: parseInt(days),
        oldestRecord: data?.[0]?.scraped_at || null,
        newestRecord: data?.[data.length - 1]?.scraped_at || null
      }
    })
    
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message
    })
  }
}
