import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Missing Supabase configuration' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Get the most recent 5 records
    const { data: recent, error: recentError } = await supabase
      .from('coinbase_rankings')
      .select('*')
      .order('scraped_at', { ascending: false })
      .limit(5)

    // Get count of all records
    const { count, error: countError } = await supabase
      .from('coinbase_rankings')
      .select('*', { count: 'exact', head: true })

    // Calculate 6 hours ago
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000)
    
    // Get records from last 6 hours
    const { data: lastSixHours, error: sixHourError } = await supabase
      .from('coinbase_rankings')
      .select('*')
      .gte('scraped_at', sixHoursAgo.toISOString())
      .order('scraped_at', { ascending: false })

    if (recentError || countError || sixHourError) {
      return res.status(500).json({
        error: 'Database query failed',
        details: { recentError, countError, sixHourError }
      })
    }

    return res.status(200).json({
      currentTime: new Date().toISOString(),
      sixHoursAgo: sixHoursAgo.toISOString(),
      totalRecords: count,
      recentRecords: recent?.length || 0,
      recordsLastSixHours: lastSixHours?.length || 0,
      mostRecentRecord: recent?.[0] || null,
      oldestInSixHours: lastSixHours?.[lastSixHours.length - 1] || null
    })
    
  } catch (error) {
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    })
  }
}
