'use client'

import { format } from 'date-fns'

export default function StatsCards({ data, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 text-center text-gray-500">
          <p className="text-sm">No data available</p>
        </div>
      </div>
    )
  }

  // Calculate statistics
  const currentRanking = data[data.length - 1]
  const previousRanking = data.length > 1 ? data[data.length - 2] : null
  
  const rankings = data.map(item => item.ranking).filter(r => r !== null)
  const bestRanking = rankings.length > 0 ? Math.min(...rankings) : null
  const worstRanking = rankings.length > 0 ? Math.max(...rankings) : null
  
  const rankingChange = previousRanking && currentRanking.ranking && previousRanking.ranking
    ? currentRanking.ranking - previousRanking.ranking
    : null

  const lastUpdated = currentRanking ? format(new Date(currentRanking.scraped_at), 'MMM dd, HH:mm') : null

  const getRankingChangeColor = (change) => {
    if (change === null || change === 0) return 'text-gray-600'
    return change < 0 ? 'text-green-600' : 'text-red-600' // Negative is better (higher rank)
  }

  const getRankingChangeIcon = (change) => {
    if (change === null || change === 0) return '→'
    return change < 0 ? '↗️' : '↘️'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Current Ranking */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Current Ranking</p>
            <p className="text-2xl font-bold text-gray-900">
              {currentRanking?.ranking ? `#${currentRanking.ranking}` : 'N/A'}
            </p>
            {rankingChange !== null && (
              <p className={`text-sm ${getRankingChangeColor(rankingChange)}`}>
                {getRankingChangeIcon(rankingChange)} {Math.abs(rankingChange)} 
                {rankingChange < 0 ? ' up' : rankingChange > 0 ? ' down' : ''}
              </p>
            )}
          </div>
          <div className="text-3xl">📱</div>
        </div>
      </div>

      {/* Best Ranking */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Best Ranking</p>
            <p className="text-2xl font-bold text-green-600">
              {bestRanking ? `#${bestRanking}` : 'N/A'}
            </p>
            <p className="text-sm text-gray-500">All time</p>
          </div>
          <div className="text-3xl">🏆</div>
        </div>
      </div>

      {/* Worst Ranking */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Worst Ranking</p>
            <p className="text-2xl font-bold text-red-600">
              {worstRanking ? `#${worstRanking}` : 'N/A'}
            </p>
            <p className="text-sm text-gray-500">All time</p>
          </div>
          <div className="text-3xl">📉</div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Last Updated</p>
            <p className="text-lg font-bold text-gray-900">
              {lastUpdated || 'N/A'}
            </p>
            <p className="text-sm text-gray-500">
              Rating: {currentRanking?.rating ? `${currentRanking.rating}⭐` : 'N/A'}
            </p>
          </div>
          <div className="text-3xl">⏰</div>
        </div>
      </div>
    </div>
  )
}
