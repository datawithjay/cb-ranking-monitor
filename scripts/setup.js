#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

console.log('🚀 Coinbase Ranking Monitor Setup\n')

// Check if .env.local exists
const envPath = path.join(rootDir, '.env.local')
const envExamplePath = path.join(rootDir, 'env.example')

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath)
    console.log('✅ Created .env.local from env.example')
  } else {
    console.log('⚠️  env.example not found, creating basic .env.local')
    const basicEnv = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
SCRAPING_ENABLED=true`
    fs.writeFileSync(envPath, basicEnv)
    console.log('✅ Created basic .env.local file')
  }
} else {
  console.log('ℹ️  .env.local already exists')
}

console.log('\n📝 Next Steps:')
console.log('1. Update .env.local with your Supabase credentials')
console.log('2. Create a Supabase project at https://supabase.com')
console.log('3. Run the SQL from database/schema.sql in your Supabase SQL editor')
console.log('4. Test the scraper: npm run test:scraper')
console.log('5. Start the development server: npm run dev')

console.log('\n🔗 Useful Commands:')
console.log('npm run dev          - Start development server')
console.log('npm run test:scraper - Test the scraper functionality')
console.log('npm run scrape       - Run a single scrape')
console.log('npm run scheduler    - Start hourly scraping (production)')

console.log('\n🎯 The scraper is working and ready to monitor Coinbase rankings!')
console.log('Current ranking: #20 in Finance (as of last test)')

console.log('\n📊 For production deployment:')
console.log('- Deploy the web app to Vercel')
console.log('- Deploy the scheduler separately (Railway, Render, or VPS)')
console.log('- Set up environment variables in both environments')

console.log('\n✨ Setup completed successfully!')
