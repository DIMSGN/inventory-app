import axios from 'axios';

const API_URL = '/api/payroll-expenses';

export const fetchPayrollExpenses = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching payroll expenses:', error);
    throw error;
  }
};

export const fetchPayrollExpensesByMonth = async (year, month) => {
  try {
    const response = await axios.get(`${API_URL}/monthly/${year}/${month}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching payroll expenses for ${month}/${year}:`, error);
    throw error;
  }
};

export const fetchPayrollExpensesByEmployee = async (employeeId) => {
  try {
    const response = await axios.get(`${API_URL}/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching payroll expenses for employee ${employeeId}:`, error);
    throw error;
  }
};

export const addPayrollExpense = async (expenseData) => {
  try {
    const response = await axios.post(API_URL, expenseData);
    return response.data;
  } catch (error) {
    console.error('Error adding payroll expense:', error);
    throw error;
  }
};

export const updatePayrollExpense = async (id, expenseData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, expenseData);
    return response.data;
  } catch (error) {
    console.error(`Error updating payroll expense id ${id}:`, error);
    throw error;
  }
};

export const deletePayrollExpense = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting payroll expense id ${id}:`, error);
    throw error;
  }
}; 