'use client'

import { useState, useEffect } from 'react'
import Header from '../components/Header'
import StatsCards from '../components/StatsCards'
import RankingChart from '../components/RankingChart'

export default function HomePage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [scraping, setScraping] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/rankings?days=365&limit=10000')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch data')
      }
      
      if (result.success) {
        setData(result.data)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const triggerManualScrape = async () => {
    try {
      setScraping(true)
      
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.details || result.error || 'Failed to scrape')
      }
      
      if (result.success) {
        // Refresh the data after successful scrape
        await fetchData()
        
        // Show success message (you could use a toast library here)
        alert(`Successfully scraped! New ranking: #${result.data.ranking}`)
      } else {
        throw new Error('Scraping failed')
      }
    } catch (err) {
      console.error('Error during manual scrape:', err)
      alert(`Scraping failed: ${err.message}`)
    } finally {
      setScraping(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Dashboard Overview
            </h2>
            <p className="text-gray-600">
              Monitor Coinbase's performance in the App Store Finance category
            </p>
          </div>
          
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button
              onClick={fetchData}
              disabled={loading}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🔄 Loading...' : '🔄 Refresh'}
            </button>
            
            <button
              onClick={triggerManualScrape}
              disabled={scraping || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {scraping ? '⏳ Scraping...' : '🔍 Manual Scrape'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <div className="text-red-400">⚠️</div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={fetchData}
                  className="text-sm text-red-600 hover:text-red-500 mt-2 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <StatsCards data={data} loading={loading} />

        {/* Chart */}
        <RankingChart data={data} loading={loading} error={error} />

        {/* Footer Info */}
        <div className="mt-12 card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            About This Monitor
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">How it works</h4>
              <ul className="space-y-1">
                <li>• Scrapes Coinbase's App Store page every hour</li>
                <li>• Extracts ranking from the Finance category</li>
                <li>• Stores historical data in Supabase</li>
                <li>• Displays trends with interactive charts</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Data Points</h4>
              <ul className="space-y-1">
                <li>• App Store ranking position</li>
                <li>• User rating (stars)</li>
                <li>• Number of ratings</li>
                <li>• Timestamp of collection</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
