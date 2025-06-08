import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_APP_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const expenseAPI = {
    createExpense: async (expenseData) => {
        try {
            const response = await api.post("/api/expenses", expenseData);
            return response.data;
        } catch (error) {
            console.error("Error creating expense:", error);
            throw error;
        }
    },
    getExpenses: async (filters = {}) => {
        const params = new URLSearchParams();
        if(filters.category) {
            params.append("category", filters.category);
        }
        if(filters.payment_mode){
            params.append("payment_mode", filters.payment_mode);
        }
        if(filters.dateRange) {
            params.append("dateRange", filters.dateRange);
        }
        const response = await api.get(`/api/expenses?${params.toString()}`);
        return response.data;
    },
     getAnalytics: async() =>{
        const response = await api.get("/api/expenses/analytics");
        return response.data;
     }
}

export { expenseAPI, api };