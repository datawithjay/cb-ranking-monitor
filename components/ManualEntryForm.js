'use client'

import { useState } from 'react'

export default function ManualEntryForm({ onSuccess }) {
  const [ranking, setRanking] = useState('')
  const [rating, setRating] = useState('')
  const [ratingCount, setRatingCount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    // Validate ranking is required
    if (!ranking || ranking < 1) {
      setError('Please enter a valid ranking (1 or higher)')
      return
    }
    
    try {
      setLoading(true)
      
      const response = await fetch('/api/manual-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ranking: parseInt(ranking),
          rating: rating ? parseFloat(rating) : null,
          ratingCount: ratingCount || null,
        }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || result.details || 'Failed to save entry')
      }
      
      if (result.success) {
        // Reset form
        setRanking('')
        setRating('')
        setRatingCount('')
        
        // Notify parent component
        if (onSuccess) {
          onSuccess(result.data)
        }
      } else {
        throw new Error('Failed to save entry')
      }
    } catch (err) {
      console.error('Error saving manual entry:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        📝 Manual Entry
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Enter the current ranking from the Apple App Store (view on your iPhone/iPad)
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ranking Input (Required) */}
        <div>
          <label htmlFor="ranking" className="block text-sm font-medium text-gray-700 mb-2">
            App Store Ranking <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="ranking"
            min="1"
            max="1500"
            value={ranking}
            onChange={(e) => setRanking(e.target.value)}
            placeholder="e.g., 25"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coinbase-blue focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Position in Finance category (e.g., #25)
          </p>
        </div>

        {/* Rating Input (Optional) */}
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
            Rating (Optional)
          </label>
          <input
            type="number"
            id="rating"
            min="0"
            max="5"
            step="0.1"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="e.g., 4.7"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coinbase-blue focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Star rating out of 5.0
          </p>
        </div>

        {/* Rating Count Input (Optional) */}
        <div>
          <label htmlFor="ratingCount" className="block text-sm font-medium text-gray-700 mb-2">
            Number of Ratings (Optional)
          </label>
          <input
            type="text"
            id="ratingCount"
            value={ratingCount}
            onChange={(e) => setRatingCount(e.target.value)}
            placeholder="e.g., 1.8M Ratings"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coinbase-blue focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Total number of ratings (e.g., "1.8M Ratings")
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳ Saving...' : '💾 Save Entry'}
        </button>
      </form>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">📱 How to find the ranking:</h3>
        <ol className="text-xs text-blue-800 space-y-1 ml-4 list-decimal">
          <li>Open the App Store app on your iPhone or iPad</li>
          <li>Search for "Coinbase"</li>
          <li>Tap on the app, then scroll down to "Chart Position"</li>
          <li>Note the number in the Finance category (e.g., "#25 in Finance")</li>
          <li>Enter that number above and click Save</li>
        </ol>
      </div>
    </div>
  )
}

