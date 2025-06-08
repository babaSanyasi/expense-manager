const Expense = require('../models/Expense');

const createExpense = async (req, res) => {
    try {
      const { amount, category, notes, date, payment_mode } = req.body;
  
      if (!amount || !category || !date || !payment_mode) {
        return res.status(400).json({ message: 'All required fields must be provided: amount, category, date, payment_mode' });
      }
  
      const newExpense = new Expense({ amount, category, notes, date, payment_mode });
      const saved = await newExpense.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

const getExpenses = async (req, res) => {
    try {
      const { category, payment_mode, dateRange } = req.query;
      let filter = {};
  
      if (category) filter.category = { $in: category.split(',') };
      if (payment_mode) filter.payment_mode = { $in: payment_mode.split(',') };
      if (dateRange) {
        const now = new Date();
        let startDate;
        switch (dateRange) {
          case 'thisMonth':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'last30Days':
            startDate = new Date(now.setDate(now.getDate() - 30));
            break;
          case 'last90Days':
            startDate = new Date(now.setDate(now.getDate() - 90));
            break;
          default:
            startDate = null;
        }
        if (startDate) filter.date = { $gte: startDate };
      }
  
      const expenses = await Expense.find(filter).sort({ date: -1 });
      res.json(expenses);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };


const getAnalytics = async (req, res) => {
    try {
      const result = await Expense.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
              category: "$category"
            },
            totalAmount: { $sum: "$amount" }
          }
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1
          }
        }
      ]);
  
      const formatted = {};
      result.forEach(item => {
        const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
        if (!formatted[key]) formatted[key] = {};
        formatted[key][item._id.category] = item.totalAmount;
      });
  
      const response = Object.entries(formatted).map(([month, categories]) => ({
        month,
        ...categories
      }));
  
      res.json(response);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createExpense,
    getExpenses,
    getAnalytics
};