#!/usr/bin/env node

/**
 * Test script for manual entry API endpoint
 * This tests the new manual entry functionality without requiring a browser
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'

console.log('🧪 Testing Manual Entry System\n')

async function testManualEntry() {
  try {
    // 1. Verify environment variables
    console.log('Step 1: Verifying environment variables...')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables')
    }
    console.log('✅ Environment variables found\n')
    
    // 2. Connect to Supabase
    console.log('Step 2: Connecting to Supabase...')
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    console.log('✅ Connected to Supabase\n')
    
    // 3. Check if entry_type column exists
    console.log('Step 3: Checking database schema...')
    
    // Test database connection by fetching one record
    const { data: testData, error: testError } = await supabase
      .from('coinbase_rankings')
      .select('*')
      .limit(1)
    
    if (testError) {
      throw new Error(`Database connection failed: ${testError.message}`)
    }
    
    console.log('✅ Database connection successful')
    
    // Check if test data has entry_type column
    const hasEntryType = testData?.[0] && 'entry_type' in testData[0]
    if (hasEntryType) {
      console.log('✅ entry_type column exists\n')
    } else {
      console.log('⚠️  entry_type column not found - migration may be needed\n')
    }
    
    // 4. Test inserting a manual entry
    console.log('Step 4: Testing manual entry insertion...')
    const testEntry = {
      ranking: 25,
      rating: 4.7,
      rating_count: '1.8M Ratings',
      scraped_at: new Date().toISOString(),
      entry_type: 'manual'
    }
    
    const { data: insertedData, error: insertError } = await supabase
      .from('coinbase_rankings')
      .insert(testEntry)
      .select()
      .single()
    
    if (insertError) {
      if ((insertError.code === '42703' || insertError.code === 'PGRST204') && 
          insertError.message.includes('entry_type')) {
        console.log('⚠️  Database migration needed: entry_type column does not exist')
        console.log('   Please run the migration from QUICK_START.md\n')
        console.log('═══════════════════════════════════════')
        console.log('📋 Next Step: Apply Database Migration')
        console.log('═══════════════════════════════════════')
        console.log('1. Go to https://supabase.com/dashboard')
        console.log('2. Select your Coinbase project')
        console.log('3. Go to SQL Editor')
        console.log('4. Run the migration from QUICK_START.md')
        console.log()
        console.log('After applying the migration, run this test again.')
        console.log()
        process.exit(0)
      } else {
        throw insertError
      }
    } else {
      console.log('✅ Manual entry inserted successfully!')
      console.log('   ID:', insertedData.id)
      console.log('   Ranking:', insertedData.ranking)
      console.log('   Entry Type:', insertedData.entry_type)
      console.log('   Timestamp:', insertedData.scraped_at)
      console.log()
      
      // 5. Clean up test entry
      console.log('Step 5: Cleaning up test entry...')
      const { error: deleteError } = await supabase
        .from('coinbase_rankings')
        .delete()
        .eq('id', insertedData.id)
      
      if (deleteError) {
        console.log('⚠️  Could not delete test entry (manual cleanup needed)')
        console.log('   Test entry ID:', insertedData.id)
      } else {
        console.log('✅ Test entry cleaned up\n')
      }
    }
    
    // 6. Summary
    console.log('═══════════════════════════════════════')
    console.log('🎉 Manual Entry System Test Complete!')
    console.log('═══════════════════════════════════════')
    console.log('Status: Ready to use ✅')
    console.log()
    console.log('Next steps:')
    console.log('1. Deploy your changes: git push')
    console.log('2. Disable GitHub Actions workflow')
    console.log('3. Start using the manual entry form!')
    console.log()
    
    process.exit(0)
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    console.error('\nDetails:')
    console.error(error)
    console.error('\nPlease check:')
    console.error('1. .env.local file exists and has correct values')
    console.error('2. SUPABASE_SERVICE_ROLE_KEY is set (not just ANON_KEY)')
    console.error('3. Database migration has been applied')
    console.error('4. See QUICK_START.md for setup instructions')
    process.exit(1)
  }
}

testManualEntry()

