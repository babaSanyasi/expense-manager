const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpenses,
  getAnalytics
} = require('../controllers/expenseController');


router.post('/', createExpense);
router.get('/', getExpenses);   
router.get('/analytics', getAnalytics);


module.exports = router;