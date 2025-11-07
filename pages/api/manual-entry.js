import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Create Supabase client with service role for write access
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ 
        error: 'Missing Supabase configuration',
        details: 'Environment variables not set'
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Extract data from request body
    const { ranking, rating, ratingCount } = req.body
    
    // Validate required fields
    if (!ranking || isNaN(ranking) || ranking < 1) {
      return res.status(400).json({
        error: 'Invalid ranking',
        details: 'Ranking must be a positive number'
      })
    }
    
    // Validate optional rating
    if (rating !== null && rating !== undefined) {
      if (isNaN(rating) || rating < 0 || rating > 5) {
        return res.status(400).json({
          error: 'Invalid rating',
          details: 'Rating must be between 0 and 5'
        })
      }
    }
    
    // Prepare data for insertion
    const insertData = {
      ranking: parseInt(ranking),
      rating: rating ? parseFloat(rating) : null,
      rating_count: ratingCount || null,
      scraped_at: new Date().toISOString(), // Timestamp for manual entry
      entry_type: 'manual' // Mark as manual entry
    }
    
    // Insert into database
    const { data, error } = await supabase
      .from('coinbase_rankings')
      .insert(insertData)
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ 
        error: 'Failed to save entry', 
        details: error.message 
      })
    }
    
    return res.status(200).json({
      success: true,
      data,
      message: 'Entry saved successfully'
    })
    
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message
    })
  }
}

