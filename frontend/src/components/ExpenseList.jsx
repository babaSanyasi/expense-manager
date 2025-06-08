import { useState, useEffect } from 'react'
import { Filter, Calendar, CreditCard } from 'lucide-react'
import { expenseAPI } from '../services/api'

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    payment_mode: '',
    dateRange: ''
  })

  const categories = [
    'Rental',
    'Groceries',
    'Entertainment',
    'Travel',
    'Others'
  ]
  const paymentModes = ['UPI', 'Credit Card', 'Net Banking', 'Cash']
  const dateRanges = [
    { value: '', label: 'All Time' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'last30Days', label: 'Last 30 Days' },
    { value: 'last90Days', label: 'Last 90 Days' }
  ]

  useEffect(() => {
    fetchExpenses()
  }, [filters])

  const fetchExpenses = async () => {
    setLoading(true)
    try {
      const data = await expenseAPI.getExpenses(filters)
      setExpenses(data)
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value
    })
  }

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatAmount = amount => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className='max-w-6xl mx-auto'>
      {/* Filters */}
      <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
        <div className='flex items-center mb-4'>
          <Filter className='h-5 w-5 text-blue-600 mr-2' />
          <h3 className='text-lg font-semibold text-gray-800'>Filters</h3>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Category
            </label>
            <select
              value={filters.category}
              onChange={e => handleFilterChange('category', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Payment Mode
            </label>
            <select
              value={filters.payment_mode}
              onChange={e => handleFilterChange('payment_mode', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>All Payment Modes</option>
              {paymentModes.map(mode => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={e => handleFilterChange('dateRange', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              {dateRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
        <div className='flex justify-between items-center'>
          <h3 className='text-lg font-semibold text-gray-800'>
            Total Expenses: {expenses.length}
          </h3>
          <div className='text-2xl font-bold text-blue-600'>
            {formatAmount(totalAmount)}
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className='bg-white rounded-lg shadow-md'>
        {loading ? (
          <div className='p-8 text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
            <p className='mt-4 text-gray-600'>Loading expenses...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className='p-8 text-center text-gray-500'>
            <p>No expenses found matching your criteria.</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Date
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Amount
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Category
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Payment Mode
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {expenses.map(expense => (
                  <tr key={expense._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <Calendar className='h-4 w-4 text-gray-400 mr-2' />
                        <span className='text-sm text-gray-900'>
                          {formatDate(expense.date)}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='text-sm font-medium text-gray-900'>
                        {formatAmount(expense.amount)}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'>
                        {expense.category}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <CreditCard className='h-4 w-4 text-gray-400 mr-2' />
                        <span className='text-sm text-gray-900'>
                          {expense.payment_mode}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-sm text-gray-900'>
                        {expense.notes || '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExpenseList
