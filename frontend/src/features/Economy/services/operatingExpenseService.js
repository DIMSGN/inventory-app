import axios from 'axios';

const API_URL = '/api/operating-expenses';

export const fetchOperatingExpenses = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching operating expenses:', error);
    throw error;
  }
};

export const fetchOperatingExpensesByMonth = async (year, month) => {
  try {
    const response = await axios.get(`${API_URL}/monthly/${year}/${month}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching operating expenses for ${month}/${year}:`, error);
    throw error;
  }
};

export const fetchOperatingExpensesByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching operating expenses for category ${category}:`, error);
    throw error;
  }
};

export const addOperatingExpense = async (expenseData) => {
  try {
    const response = await axios.post(API_URL, expenseData);
    return response.data;
  } catch (error) {
    console.error('Error adding operating expense:', error);
    throw error;
  }
};

export const updateOperatingExpense = async (id, expenseData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, expenseData);
    return response.data;
  } catch (error) {
    console.error(`Error updating operating expense id ${id}:`, error);
    throw error;
  }
};

export const deleteOperatingExpense = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting operating expense id ${id}:`, error);
    throw error;
  }
}; 