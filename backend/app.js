const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const expenseRoutes = require('./routes/expenses')
const connectDB = require('./config/db');
dotenv.config();
const app = express();

connectDB();

app.use(
  cors({
    origin: 'https://expense-manager-git-main-expense-manager-team2308.vercel.app',
    credentials: true
  })
);
app.use(express.json());


app.use('/api/expenses', expenseRoutes);


const  PORT = process.env.PORT || 5000;
 app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });   