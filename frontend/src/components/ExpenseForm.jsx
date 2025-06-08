import { useState } from 'react'
import { Plus } from 'lucide-react'
import { expenseAPI } from '../services/api'

const ExpenseForm = ({ onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    payment_mode: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const categories = [
    'Rental',
    'Groceries',
    'Entertainment',
    'Travel',
    'Others'
  ]
  const paymentModes = ['UPI', 'Credit Card', 'Net Banking', 'Cash']

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await expenseAPI.createExpense({
        ...formData,
        amount: Number.parseFloat(formData.amount)
      })

      setMessage('Expense added successfully!')
      setFormData({
        amount: '',
        category: '',
        notes: '',
        date: new Date().toISOString().split('T')[0],
        payment_mode: ''
      })

      if (onExpenseAdded) onExpenseAdded()
    } catch (error) {
      setMessage('Error adding expense. Please try again.')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6'>
      <div className='flex items-center mb-6'>
        <Plus className='h-6 w-6 text-blue-600 mr-2' />
        <h2 className='text-2xl font-bold text-gray-800'>Add New Expense</h2>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.includes('Error')
              ? 'bg-red-100 text-red-700 border border-red-300'
              : 'bg-green-100 text-green-700 border border-green-300'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Amount *
            </label>
            <input
              type='number'
              name='amount'
              value={formData.amount}
              onChange={handleChange}
              step='0.01'
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='0.00'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Category *
            </label>
            <select
              name='category'
              value={formData.category}
              onChange={handleChange}
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Date *
            </label>
            <input
              type='date'
              name='date'
              value={formData.date}
              onChange={handleChange}
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Payment Mode *
            </label>
            <select
              name='payment_mode'
              value={formData.payment_mode}
              onChange={handleChange}
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Select Payment Mode</option>
              {paymentModes.map(mode => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Notes
          </label>
          <textarea
            name='notes'
            value={formData.notes}
            onChange={handleChange}
            rows='3'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Optional notes...'
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  )
}

export default ExpenseForm;
