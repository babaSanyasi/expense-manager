const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['Rental', 'Groceries', 'Entertainment', 'Travel', 'Others'],
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    required: true
  },
  payment_mode: {
    type: String,
    enum: ['UPI', 'Credit Card', 'Net Banking', 'Cash'],
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Expense', ExpenseSchema);
