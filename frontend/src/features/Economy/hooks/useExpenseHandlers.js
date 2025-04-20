import { useCallback } from 'react';
import { expensesService } from '../../../common/services/apiServices';
import { getTodayISOString } from '../utils/expenseUtils';

/**
 * Custom hook for expense operation handlers
 * 
 * @param {Object} expenseState - State from useExpenseManagement
 * @returns {Object} Expense operation handlers
 */
const useExpenseHandlers = (expenseState) => {
  const {
    operatingExpenses,
    payrollExpenses,
    setOperatingExpenses,
    setPayrollExpenses,
    setOperatingExpense,
    setPayrollExpense,
    setIsLoading,
    setIsDeleting,
    setError,
    setSuccessWithTimeout,
    setShowDeleteModal,
    deleteTarget
  } = expenseState;

  /**
   * Handle operating expense submission
   * @param {Event} e - Form submit event
   */
  const handleOperatingExpenseSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await expensesService.recordOperatingExpense(expenseState.operatingExpense);
      
      // Add the new expense to the list
      setOperatingExpenses([
        response.data,
        ...operatingExpenses
      ]);
      
      // Success message
      setSuccessWithTimeout("Operating expense recorded successfully.");
      
      // Reset form
      setOperatingExpense({
        description: '',
        amount: '',
        category: '',
        expense_date: getTodayISOString()
      });
    } catch (err) {
      console.error("Error recording operating expense:", err);
      setError(`Failed to record expense: ${err.response?.data?.error || 'Please try again later.'}`);
    } finally {
      setIsLoading(false);
    }
  }, [expenseState.operatingExpense, operatingExpenses, setError, setIsLoading, setOperatingExpense, setOperatingExpenses, setSuccessWithTimeout]);

  /**
   * Handle payroll expense submission
   * @param {Event} e - Form submit event
   */
  const handlePayrollExpenseSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await expensesService.recordPayrollExpense(expenseState.payrollExpense);
      
      // Add the new expense to the list
      setPayrollExpenses([
        response.data,
        ...payrollExpenses
      ]);
      
      // Success message
      setSuccessWithTimeout("Payroll expense recorded successfully.");
      
      // Reset form
      setPayrollExpense({
        employee_name: '',
        amount: '',
        department: '',
        expense_date: getTodayISOString()
      });
    } catch (err) {
      console.error("Error recording payroll expense:", err);
      setError(`Failed to record expense: ${err.response?.data?.error || 'Please try again later.'}`);
    } finally {
      setIsLoading(false);
    }
  }, [expenseState.payrollExpense, payrollExpenses, setError, setIsLoading, setPayrollExpense, setPayrollExpenses, setSuccessWithTimeout]);

  /**
   * Handle expense delete button click
   * @param {string|number} id - Expense ID
   * @param {string} type - Expense type ('operating' or 'payroll')
   */
  const handleDeleteClick = useCallback((id, type) => {
    expenseState.setDeleteTarget({ id, type });
    expenseState.setShowDeleteModal(true);
  }, [expenseState]);

  /**
   * Handle expense delete confirmation
   */
  const handleConfirmDelete = useCallback(async () => {
    setIsDeleting(true);
    
    try {
      if (deleteTarget.type === 'operating') {
        await expensesService.deleteOperatingExpense(deleteTarget.id);
        setOperatingExpenses(operatingExpenses.filter(expense => expense.id !== deleteTarget.id));
      } else if (deleteTarget.type === 'payroll') {
        await expensesService.deletePayrollExpense(deleteTarget.id);
        setPayrollExpenses(payrollExpenses.filter(expense => expense.id !== deleteTarget.id));
      }
      
      setSuccessWithTimeout("Expense deleted successfully.");
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError(`Failed to delete expense: ${err.response?.data?.error || 'Please try again later.'}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  }, [deleteTarget, operatingExpenses, payrollExpenses, setError, setIsDeleting, setOperatingExpenses, setPayrollExpenses, setShowDeleteModal, setSuccessWithTimeout]);

  return {
    handleOperatingExpenseSubmit,
    handlePayrollExpenseSubmit,
    handleDeleteClick,
    handleConfirmDelete
  };
};

export default useExpenseHandlers; 