# Expense Manager

A full-stack Expense Manager application built with React (frontend) and Node.js/Express/MongoDB (backend).

## Features

- Add, view, and filter expenses by category, payment mode, and date range
- Visual analytics with charts and monthly/category breakdowns
- Responsive UI with Tailwind CSS
- RESTful API with MongoDB for persistent storage

## Project Structure

```
backend/
  app.js
  .env
  package.json
  config/
    db.js
  controllers/
    expenseController.js
  models/
    Expense.js
  routes/
    expenses.js

frontend/
  .env
  package.json
  vite.config.js
  index.html
  src/
    App.jsx
    main.jsx
    index.css
    components/
      Header.jsx
      Navigation.jsx
      ExpenseForm.jsx
      ExpenseList.jsx
      Analytics.jsx
    services/
      api.js
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. Go to the `backend` directory:

   ```sh
   cd backend
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Configure environment variables in `.env`:

   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Start the backend server:

   ```sh
   node app.js
   # or for development with auto-reload
   npx nodemon app.js
   ```

### Frontend Setup

1. Go to the `frontend` directory:

   ```sh
   cd frontend
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Configure the API URL in `.env` (default is `http://localhost:5000/api`):

   ```
   
   ```

4. Start the frontend development server:

   ```sh
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## API Endpoints

- `POST /api/expenses` — Add a new expense
- `GET /api/expenses` — Get expenses (supports filters: `category`, `payment_mode`, `dateRange`)
- `GET /api/expenses/analytics` — Get analytics data

## Technologies Used

- **Frontend:** React, Vite, Tailwind CSS, Chart.js, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Other:** dotenv, cors

## License

MIT

---

**Note:**  
Update the `.env` files with your own credentials and API URLs as needed.
