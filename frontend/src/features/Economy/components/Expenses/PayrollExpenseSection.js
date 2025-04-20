import React from 'react';
import { FaUsers } from 'react-icons/fa';
import ExpenseCard from './components/ExpenseCard';
import ExpenseTable from './components/ExpenseTable';
import PayrollExpenseForm from './components/PayrollExpenseForm';
import { formatDate } from '../../utils/expenseUtils';

/**
 * Payroll expense section component
 * 
 * @param {Object} props - Component props
 * @param {Array} props.payrollExpenses - Payroll expenses data
 * @param {Object} props.payrollExpense - Payroll expense form data
 * @param {Function} props.setPayrollExpense - Function to update form data
 * @param {Function} props.handlePayrollExpenseSubmit - Form submit handler
 * @param {Function} props.handleDeleteClick - Delete button click handler
 * @param {boolean} props.isLoading - Loading state flag
 * @param {string} props.error - Error message
 * @param {string} props.success - Success message
 * @returns {JSX.Element} PayrollExpenseSection component
 */
const PayrollExpenseSection = ({
  payrollExpenses,
  payrollExpense,
  setPayrollExpense,
  handlePayrollExpenseSubmit,
  handleDeleteClick,
  isLoading,
  error,
  success
}) => {
  // Define payroll expense table columns
  const columns = [
    { 
      title: 'Date', 
      dataKey: 'expense_date',
      render: (expense) => formatDate(expense.expense_date)
    },
    { 
      title: 'Employee',
      dataKey: 'employee_name'
    },
    { 
      title: 'Department',
      dataKey: 'department'
    },
    { 
      title: 'Amount',
      dataKey: 'amount',
      className: 'text-end',
      render: (expense) => formatCurrency(expense.amount)
    }
  ];

  return (
    <>
      <ExpenseCard 
        icon={<FaUsers />} 
        title="Record Payroll Expense"
      >
        <PayrollExpenseForm 
          formData={payrollExpense}
          setFormData={setPayrollExpense}
          onSubmit={handlePayrollExpenseSubmit}
          isSubmitting={isLoading}
          error={error}
          success={success}
        />
      </ExpenseCard>

      <ExpenseCard title="Payroll Expenses List">
        <ExpenseTable 
          expenses={payrollExpenses}
          handleDeleteClick={handleDeleteClick}
          isLoading={isLoading}
          expenseType="payroll"
          columns={columns}
        />
      </ExpenseCard>
    </>
  );
};

// Helper function for formatting currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default PayrollExpenseSection; 