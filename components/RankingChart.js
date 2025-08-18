'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'
import { format } from 'date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
)

export default function RankingChart({ data, loading, error }) {
  const chartRef = useRef()
  const [timeRange, setTimeRange] = useState('24h')

  const filterDataByTimeRange = (data, range) => {
    if (!data || data.length === 0) return []
    
    const now = new Date()
    let cutoffTime
    
    switch (range) {
      case '6h':
        cutoffTime = new Date(now.getTime() - 6 * 60 * 60 * 1000)
        break
      case '24h':
        cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        cutoffTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        cutoffTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        return data
    }
    
    return data.filter(item => new Date(item.scraped_at) >= cutoffTime)
  }

  const filteredData = filterDataByTimeRange(data, timeRange)

  const chartData = {
    labels: filteredData.map(item => {
      const date = new Date(item.scraped_at)
      return isNaN(date.getTime()) ? new Date() : date
    }),
    datasets: [
      {
        label: 'App Store Ranking',
        data: filteredData.map(item => item.ranking),
        borderColor: '#0052FF',
        backgroundColor: 'rgba(0, 82, 255, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#0052FF',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'Coinbase App Store Ranking Over Time',
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#0052FF',
        borderWidth: 1,
        callbacks: {
          title: function(context) {
            try {
              const date = new Date(context[0].label)
              if (isNaN(date.getTime())) {
                return 'Invalid Date'
              }
              return format(date, 'MMM dd, yyyy HH:mm')
            } catch (error) {
              return 'Invalid Date'
            }
          },
          label: function(context) {
            return `Ranking: #${context.parsed.y}`
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          displayFormats: {
            hour: 'HH:mm',
            day: 'MMM dd',
            week: 'MMM dd',
            month: 'MMM yyyy'
          },
        },
        title: {
          display: true,
          text: 'Time',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      y: {
        reverse: true, // Lower ranking numbers should be higher on the chart
        beginAtZero: false,
        title: {
          display: true,
          text: 'App Store Ranking',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return `#${value}`
          }
        }
      },
    },
  }

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="text-center text-red-600">
          <h3 className="text-lg font-semibold mb-2">Error Loading Chart</h3>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="card p-6">
        <div className="text-center text-gray-500">
          <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
          <p>No ranking data has been collected yet. Please check back later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">
          Ranking Timeline
        </h2>
        <div className="flex space-x-2">
          {['6h', '24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-coinbase-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-64 sm:h-80">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Showing {filteredData.length} data points from the last {timeRange}</p>
        {filteredData.length > 0 && (
          <p>
            Latest ranking: #{filteredData[filteredData.length - 1]?.ranking} 
            {' '}({(() => {
              try {
                const date = new Date(filteredData[filteredData.length - 1]?.scraped_at)
                if (isNaN(date.getTime())) return 'Invalid Date'
                return format(date, 'MMM dd, HH:mm')
              } catch (error) {
                return 'Invalid Date'
              }
            })()})
          </p>
        )}
      </div>
    </div>
  )
}
