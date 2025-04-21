import { useState, useEffect, useCallback } from 'react';
import { expensesService } from '../../../common/services';
import { getTodayISOString } from '../utils/expenseUtils';

/**
 * Custom hook for managing expense operations
 * 
 * @returns {Object} Expense management state and operations
 */
const useExpenseManagement = () => {
  // State variables for expenses
  const [operatingExpenses, setOperatingExpenses] = useState([]);
  const [payrollExpenses, setPayrollExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("operating");

  // Initial form states
  const [operatingExpense, setOperatingExpense] = useState({
    description: '',
    amount: '',
    category: '',
    expense_date: getTodayISOString()
  });
  
  const [payrollExpense, setPayrollExpense] = useState({
    employee_name: '',
    amount: '',
    department: '',
    expense_date: getTodayISOString()
  });
  
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({
    id: null,
    type: null
  });

  // Fetch expenses based on active tab
  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (activeTab === 'operating') {
        const response = await expensesService.getOperatingExpenses();
        setOperatingExpenses(response.data);
      } else if (activeTab === 'payroll') {
        const response = await expensesService.getPayrollExpenses();
        setPayrollExpenses(response.data);
      }
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Failed to load expenses. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  // Load expenses when the active tab changes
  useEffect(() => {
    fetchExpenses();
  }, [activeTab, fetchExpenses]);

  // Set success message with auto-clear timer
  const setSuccessWithTimeout = useCallback((message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  }, []);

  return {
    // State
    operatingExpenses,
    payrollExpenses, 
    operatingExpense,
    payrollExpense,
    isLoading,
    isDeleting,
    error,
    success,
    activeTab,
    showDeleteModal,
    deleteTarget,
    
    // Setters
    setOperatingExpense,
    setPayrollExpense,
    setActiveTab,
    setShowDeleteModal,
    setDeleteTarget,
    setIsDeleting,
    setError,
    
    // Utility functions
    fetchExpenses,
    setSuccessWithTimeout
  };
};

export default useExpenseManagement; 