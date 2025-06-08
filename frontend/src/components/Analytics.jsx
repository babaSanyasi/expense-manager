import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { expenseAPI } from '../services/api'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const Analytics = () => {
  const [analytics, setAnalytics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const data = await expenseAPI.getAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatAmount = amount => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0)
  }

  const formatMonth = monthString => {
    const [year, month] = monthString.split('-')
    return new Date(year, month - 1).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  const categories = [
    'Rental',
    'Groceries',
    'Entertainment',
    'Travel',
    'Others'
  ]
  const categoryColors = {
    Rental: '#ef4444',
    Groceries: '#22c55e',
    Entertainment: '#a855f7',
    Travel: '#3b82f6',
    Others: '#6b7280'
  }

  const getTotalForMonth = monthData => {
    return categories.reduce((total, category) => {
      return total + (monthData[category] || 0)
    }, 0)
  }

  // Get overall category totals across all months
  const getOverallCategoryTotals = () => {
    const totals = {}
    categories.forEach(category => {
      totals[category] = analytics.reduce((sum, monthData) => {
        return sum + (monthData[category] || 0)
      }, 0)
    })
    return totals
  }

  // Stacked bar chart data for monthly comparison
  const getStackedBarData = () => {
    const labels = analytics.map(monthData => formatMonth(monthData.month))
    const datasets = categories.map(category => ({
      label: category,
      data: analytics.map(monthData => monthData[category] || 0),
      backgroundColor: categoryColors[category],
      borderColor: categoryColors[category],
      borderWidth: 1
    }))

    return { labels, datasets }
  }

  const stackedBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Expense Breakdown by Category',
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: 20
      },
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: context =>
            `${context.dataset.label}: ${formatAmount(context.parsed.y)}`,
          footer: tooltipItems => {
            const total = tooltipItems.reduce(
              (sum, item) => sum + item.parsed.y,
              0
            )
            return `Total: ${formatAmount(total)}`
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Month',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Amount (₹)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          callback: value => {
            return new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(value)
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    }
  }

  const overallTotals = getOverallCategoryTotals()
  const grandTotal = Object.values(overallTotals).reduce(
    (sum, amount) => sum + amount,
    0
  )

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='flex items-center mb-6'>
          <BarChart3 className='h-6 w-6 text-blue-600 mr-2' />
          <h2 className='text-2xl font-bold text-gray-800'>
            Expense Analytics
          </h2>
        </div>

        {loading ? (
          <div className='p-8 text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
            <p className='mt-4 text-gray-600'>Loading analytics...</p>
          </div>
        ) : analytics.length === 0 ? (
          <div className='p-8 text-center text-gray-500'>
            <p>No data available for analytics.</p>
          </div>
        ) : (
          <div className='space-y-8'>
            {/* Summary Cards */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div className='bg-blue-50 rounded-lg p-4'>
                <h4 className='text-sm font-medium text-blue-800 mb-2'>
                  Total Months
                </h4>
                <p className='text-2xl font-bold text-blue-600'>
                  {analytics.length}
                </p>
              </div>
              <div className='bg-green-50 rounded-lg p-4'>
                <h4 className='text-sm font-medium text-green-800 mb-2'>
                  Total Expenses
                </h4>
                <p className='text-2xl font-bold text-green-600'>
                  {formatAmount(grandTotal)}
                </p>
              </div>
              <div className='bg-purple-50 rounded-lg p-4'>
                <h4 className='text-sm font-medium text-purple-800 mb-2'>
                  Average/Month
                </h4>
                <p className='text-2xl font-bold text-purple-600'>
                  {formatAmount(grandTotal / analytics.length)}
                </p>
              </div>
              <div className='bg-orange-50 rounded-lg p-4'>
                <h4 className='text-sm font-medium text-orange-800 mb-2'>
                  Highest Month
                </h4>
                <p className='text-2xl font-bold text-orange-600'>
                  {formatAmount(
                    Math.max(
                      ...analytics.map(monthData => getTotalForMonth(monthData))
                    )
                  )}
                </p>
              </div>
            </div>

            {/* Stacked Bar Chart */}
            <div className='bg-white border rounded-lg p-6'>
              <div className='h-96 mb-6'>
                <Bar data={getStackedBarData()} options={stackedBarOptions} />
              </div>
            </div>

            {/* Category Summary */}
            <div className='bg-gray-50 rounded-lg p-6'>
              <div className='flex items-center mb-4'>
                <TrendingUp className='h-5 w-5 text-blue-600 mr-2' />
                <h3 className='text-lg font-semibold text-gray-800'>
                  Category-wise Total Expenses
                </h3>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
                {categories.map(category => {
                  const amount = overallTotals[category]
                  const percentage =
                    grandTotal > 0
                      ? ((amount / grandTotal) * 100).toFixed(1)
                      : 0

                  return (
                    <div
                      key={category}
                      className='bg-white rounded-lg p-4 border'
                    >
                      <div className='flex items-center mb-2'>
                        <div
                          className='w-4 h-4 rounded mr-2'
                          style={{ backgroundColor: categoryColors[category] }}
                        ></div>
                        <h4 className='text-sm font-medium text-gray-700'>
                          {category}
                        </h4>
                      </div>
                      <p className='text-xl font-bold text-gray-900'>
                        {formatAmount(amount)}
                      </p>
                      <p className='text-sm text-gray-500'>
                        {percentage}% of total
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Monthly Details Table */}
            <div className='bg-white border rounded-lg overflow-hidden'>
              <div className='px-6 py-4 bg-gray-50 border-b'>
                <h3 className='text-lg font-semibold text-gray-800'>
                  Monthly Breakdown
                </h3>
              </div>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Month
                      </th>
                      {categories.map(category => (
                        <th
                          key={category}
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          {category}
                        </th>
                      ))}
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {analytics.map(monthData => {
                      const monthTotal = getTotalForMonth(monthData)
                      return (
                        <tr key={monthData.month} className='hover:bg-gray-50'>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                            {formatMonth(monthData.month)}
                          </td>
                          {categories.map(category => (
                            <td
                              key={category}
                              className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'
                            >
                              {monthData[category]
                                ? formatAmount(monthData[category])
                                : '-'}
                            </td>
                          ))}
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600'>
                            {formatAmount(monthTotal)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analytics
