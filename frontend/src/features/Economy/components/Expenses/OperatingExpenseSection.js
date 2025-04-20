import React from 'react';
import { FaBuilding } from 'react-icons/fa';
import ExpenseCard from './components/ExpenseCard';
import ExpenseTable from './components/ExpenseTable';
import OperatingExpenseForm from './components/OperatingExpenseForm';
import { formatDate } from '../../utils/expenseUtils';

/**
 * Operating expense section component
 * 
 * @param {Object} props - Component props
 * @param {Array} props.operatingExpenses - Operating expenses data
 * @param {Object} props.operatingExpense - Operating expense form data
 * @param {Function} props.setOperatingExpense - Function to update form data
 * @param {Function} props.handleOperatingExpenseSubmit - Form submit handler
 * @param {Function} props.handleDeleteClick - Delete button click handler
 * @param {boolean} props.isLoading - Loading state flag
 * @param {string} props.error - Error message
 * @param {string} props.success - Success message
 * @returns {JSX.Element} OperatingExpenseSection component
 */
const OperatingExpenseSection = ({
  operatingExpenses,
  operatingExpense,
  setOperatingExpense,
  handleOperatingExpenseSubmit,
  handleDeleteClick,
  isLoading,
  error,
  success
}) => {
  // Define operating expense table columns
  const columns = [
    { 
      title: 'Date', 
      dataKey: 'expense_date',
      render: (expense) => formatDate(expense.expense_date)
    },
    { 
      title: 'Description',
      dataKey: 'description'
    },
    { 
      title: 'Category',
      dataKey: 'category'
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
        icon={<FaBuilding />} 
        title="Record Operating Expense"
      >
        <OperatingExpenseForm 
          formData={operatingExpense}
          setFormData={setOperatingExpense}
          onSubmit={handleOperatingExpenseSubmit}
          isSubmitting={isLoading}
          error={error}
          success={success}
        />
      </ExpenseCard>

      <ExpenseCard title="Operating Expenses List">
        <ExpenseTable 
          expenses={operatingExpenses}
          handleDeleteClick={handleDeleteClick}
          isLoading={isLoading}
          expenseType="operating"
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

export default OperatingExpenseSection; 