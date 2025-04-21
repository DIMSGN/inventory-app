import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { salesService, expensesService } from '../services';

// Create the context
const EconomyContext = createContext();

// Custom hook to use the Economy context
export function useEconomy() {
  const context = useContext(EconomyContext);
  if (!context) {
    throw new Error('useEconomy must be used within an EconomyProvider');
  }
  return context;
}

// Economy Provider Component
export function EconomyProvider({ children }) {
  // State for sales data
  const [salesData, setSalesData] = useState([]);
  const [dailySummary, setDailySummary] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);
  
  // State for expense data
  const [payrollExpenses, setPayrollExpenses] = useState([]);
  const [operatingExpenses, setOperatingExpenses] = useState([]);
  
  // Loading and error states
  const [loading, setLoading] = useState({
    sales: false,
    dailySummary: false,
    monthlySummary: false,
    payrollExpenses: false,
    operatingExpenses: false,
  });
  
  const [error, setError] = useState({
    sales: null,
    dailySummary: null,
    monthlySummary: null,
    payrollExpenses: null,
    operatingExpenses: null,
  });

  // Helper function to reset errors for a specific data type
  const resetError = (dataType) => {
    setError((prev) => ({ ...prev, [dataType]: null }));
  };

  // Fetch all sales data
  const fetchSalesData = useCallback(async () => {
    resetError('sales');
    setLoading((prev) => ({ ...prev, sales: true }));
    
    try {
      const data = await salesService.getAllSales();
      setSalesData(data);
      return data;
    } catch (err) {
      console.error('Error fetching sales data:', err);
      setError((prev) => ({ ...prev, sales: 'Failed to fetch sales data' }));
      toast.error('Failed to load sales data');
    } finally {
      setLoading((prev) => ({ ...prev, sales: false }));
    }
  }, []);

  // Fetch daily financial summary
  const fetchDailySummary = useCallback(async () => {
    resetError('dailySummary');
    setLoading((prev) => ({ ...prev, dailySummary: true }));
    
    try {
      const data = await salesService.getDailySummary();
      setDailySummary(data);
      return data;
    } catch (err) {
      console.error('Error fetching daily summary:', err);
      setError((prev) => ({ ...prev, dailySummary: 'Failed to fetch daily summary' }));
      toast.error('Failed to load daily financial summary');
    } finally {
      setLoading((prev) => ({ ...prev, dailySummary: false }));
    }
  }, []);

  // Fetch monthly financial summary
  const fetchMonthlySummary = useCallback(async () => {
    resetError('monthlySummary');
    setLoading((prev) => ({ ...prev, monthlySummary: true }));
    
    try {
      const data = await salesService.getMonthlySummary();
      setMonthlySummary(data);
      return data;
    } catch (err) {
      console.error('Error fetching monthly summary:', err);
      setError((prev) => ({ ...prev, monthlySummary: 'Failed to fetch monthly summary' }));
      toast.error('Failed to load monthly financial summary');
    } finally {
      setLoading((prev) => ({ ...prev, monthlySummary: false }));
    }
  }, []);

  // Fetch payroll expenses
  const fetchPayrollExpenses = useCallback(async () => {
    resetError('payrollExpenses');
    setLoading((prev) => ({ ...prev, payrollExpenses: true }));
    
    try {
      const data = await expensesService.getPayrollExpenses();
      setPayrollExpenses(data);
      return data;
    } catch (err) {
      console.error('Error fetching payroll expenses:', err);
      setError((prev) => ({ ...prev, payrollExpenses: 'Failed to fetch payroll expenses' }));
      toast.error('Failed to load payroll expenses');
    } finally {
      setLoading((prev) => ({ ...prev, payrollExpenses: false }));
    }
  }, []);

  // Fetch operating expenses
  const fetchOperatingExpenses = useCallback(async () => {
    resetError('operatingExpenses');
    setLoading((prev) => ({ ...prev, operatingExpenses: true }));
    
    try {
      const data = await expensesService.getOperatingExpenses();
      setOperatingExpenses(data);
      return data;
    } catch (err) {
      console.error('Error fetching operating expenses:', err);
      setError((prev) => ({ ...prev, operatingExpenses: 'Failed to fetch operating expenses' }));
      toast.error('Failed to load operating expenses');
    } finally {
      setLoading((prev) => ({ ...prev, operatingExpenses: false }));
    }
  }, []);

  // Add a new payroll expense
  const addPayrollExpense = async (expenseData) => {
    try {
      const response = await expensesService.recordPayrollExpense(expenseData);
      setPayrollExpenses((prev) => [response.data, ...prev]);
      toast.success('Payroll expense added successfully');
      return response.data;
    } catch (err) {
      console.error('Error adding payroll expense:', err);
      toast.error('Failed to add payroll expense');
      throw err;
    }
  };

  // Delete a payroll expense
  const deletePayrollExpense = async (id) => {
    try {
      await expensesService.deletePayrollExpense(id);
      setPayrollExpenses((prev) => prev.filter(expense => expense.id !== id));
      toast.success('Payroll expense deleted successfully');
    } catch (err) {
      console.error('Error deleting payroll expense:', err);
      toast.error('Failed to delete payroll expense');
      throw err;
    }
  };

  // Add a new operating expense
  const addOperatingExpense = async (expenseData) => {
    try {
      const response = await expensesService.recordOperatingExpense(expenseData);
      setOperatingExpenses((prev) => [response.data, ...prev]);
      toast.success('Operating expense added successfully');
      return response.data;
    } catch (err) {
      console.error('Error adding operating expense:', err);
      toast.error('Failed to add operating expense');
      throw err;
    }
  };

  // Delete an operating expense
  const deleteOperatingExpense = async (id) => {
    try {
      await expensesService.deleteOperatingExpense(id);
      setOperatingExpenses((prev) => prev.filter(expense => expense.id !== id));
      toast.success('Operating expense deleted successfully');
    } catch (err) {
      console.error('Error deleting operating expense:', err);
      toast.error('Failed to delete operating expense');
      throw err;
    }
  };

  // Record a sale (food recipe)
  const recordFoodSale = async (saleData) => {
    try {
      const response = await salesService.recordFoodSale(saleData);
      await fetchSalesData();
      await fetchDailySummary();
      await fetchMonthlySummary();
      toast.success('Food sale recorded successfully');
      return response.data;
    } catch (err) {
      console.error('Error recording food sale:', err);
      toast.error('Failed to record food sale');
      throw err;
    }
  };

  // Record a coffee sale
  const recordCoffeeSale = async (saleData) => {
    try {
      const response = await salesService.recordCoffeeSale(saleData);
      await fetchSalesData();
      await fetchDailySummary();
      await fetchMonthlySummary();
      toast.success('Coffee sale recorded successfully');
      return response.data;
    } catch (err) {
      console.error('Error recording coffee sale:', err);
      toast.error('Failed to record coffee sale');
      throw err;
    }
  };

  // Record a cocktail sale
  const recordCocktailSale = async (saleData) => {
    try {
      const response = await salesService.recordCocktailSale(saleData);
      await fetchSalesData();
      await fetchDailySummary();
      await fetchMonthlySummary();
      toast.success('Cocktail sale recorded successfully');
      return response.data;
    } catch (err) {
      console.error('Error recording cocktail sale:', err);
      toast.error('Failed to record cocktail sale');
      throw err;
    }
  };

  // Record a drink sale
  const recordDrinkSale = async (saleData) => {
    try {
      const response = await salesService.recordDrinkSale(saleData);
      await fetchSalesData();
      await fetchDailySummary();
      await fetchMonthlySummary();
      toast.success('Drink sale recorded successfully');
      return response.data;
    } catch (err) {
      console.error('Error recording drink sale:', err);
      toast.error('Failed to record drink sale');
      throw err;
    }
  };
  
  // Refresh all data
  const refreshAllData = useCallback(async () => {
    const results = {
      sales: null,
      dailySummary: null,
      monthlySummary: null,
      payrollExpenses: null,
      operatingExpenses: null
    };
    
    try {
      // Run each fetch operation individually with try/catch rather than Promise.all
      // to prevent one failure from affecting the others
      try {
        results.sales = await fetchSalesData();
      } catch (err) {
        console.warn('Error refreshing sales data:', err.message);
      }
      
      try {
        results.dailySummary = await fetchDailySummary();
      } catch (err) {
        console.warn('Error refreshing daily summary:', err.message);
      }
      
      try {
        results.monthlySummary = await fetchMonthlySummary();
      } catch (err) {
        console.warn('Error refreshing monthly summary:', err.message);
      }
      
      try {
        results.payrollExpenses = await fetchPayrollExpenses();
      } catch (err) {
        console.warn('Error refreshing payroll expenses:', err.message);
      }
      
      try {
        results.operatingExpenses = await fetchOperatingExpenses();
      } catch (err) {
        console.warn('Error refreshing operating expenses:', err.message);
      }

      return results;
    } catch (err) {
      console.error('General error refreshing economy data:', err);
      return results;
    }
  }, [fetchSalesData, fetchDailySummary, fetchMonthlySummary, fetchPayrollExpenses, fetchOperatingExpenses]);

  // Initialize data on component mount and refresh every 5 minutes
  useEffect(() => {
    refreshAllData();
    
    const interval = setInterval(() => {
      refreshAllData();
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [refreshAllData]);

  // Calculate daily expenses total
  const calculateDailyExpensesTotal = (date) => {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    
    const payrollTotal = payrollExpenses
      .filter(expense => new Date(expense.payment_date).toISOString().split('T')[0] === formattedDate)
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
      
    const operatingTotal = operatingExpenses
      .filter(expense => new Date(expense.expense_date).toISOString().split('T')[0] === formattedDate)
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
      
    return {
      payrollTotal,
      operatingTotal,
      total: payrollTotal + operatingTotal
    };
  };

  // Calculate monthly expenses by category
  const calculateMonthlyExpensesByCategory = (year, month) => {
    // Get all expenses for the specified month and year
    const payrollForMonth = payrollExpenses.filter(expense => {
      const expenseDate = new Date(expense.payment_date);
      return expenseDate.getFullYear() === year && expenseDate.getMonth() === month - 1;
    });
    
    const operatingForMonth = operatingExpenses.filter(expense => {
      const expenseDate = new Date(expense.expense_date);
      return expenseDate.getFullYear() === year && expenseDate.getMonth() === month - 1;
    });
    
    // Group operating expenses by category
    const operatingByCategory = operatingForMonth.reduce((acc, expense) => {
      const category = expense.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += parseFloat(expense.amount);
      return acc;
    }, {});
    
    // Group payroll expenses by department
    const payrollByDepartment = payrollForMonth.reduce((acc, expense) => {
      const department = expense.department || 'Uncategorized';
      if (!acc[department]) {
        acc[department] = 0;
      }
      acc[department] += parseFloat(expense.amount);
      return acc;
    }, {});
    
    return {
      operatingByCategory,
      payrollByDepartment,
      totalOperating: operatingForMonth.reduce((sum, expense) => sum + parseFloat(expense.amount), 0),
      totalPayroll: payrollForMonth.reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
    };
  };

  // Context value with all state and functions
  const value = {
    // Sales data
    salesData,
    dailySummary,
    monthlySummary,
    
    // Expense data
    payrollExpenses,
    operatingExpenses,
    
    // Loading and error states
    loading,
    error,
    
    // Data fetching functions
    fetchSalesData,
    fetchDailySummary,
    fetchMonthlySummary,
    fetchPayrollExpenses,
    fetchOperatingExpenses,
    refreshAllData,
    
    // Sales recording functions
    recordFoodSale,
    recordCoffeeSale,
    recordCocktailSale,
    recordDrinkSale,
    
    // Expense management functions
    addPayrollExpense,
    deletePayrollExpense,
    addOperatingExpense,
    deleteOperatingExpense,
    
    // Calculation functions
    calculateDailyExpensesTotal,
    calculateMonthlyExpensesByCategory
  };

  return (
    <EconomyContext.Provider value={value}>
      {children}
    </EconomyContext.Provider>
  );
}

export default EconomyContext; 