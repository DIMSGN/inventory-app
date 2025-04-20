import React from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { formatCurrency } from '../../../utils/expenseUtils';
import '../../../styles/expenses.css';

/**
 * Reusable table component for displaying expense data
 * 
 * @param {Object} props - Component props
 * @param {Array} props.expenses - Array of expense objects to display
 * @param {Function} props.handleDeleteClick - Function to handle delete button clicks
 * @param {boolean} props.isLoading - Loading state flag
 * @param {string} props.expenseType - Type of expense ('operating' or 'payroll')
 * @param {Array} props.columns - Column configuration
 * @returns {JSX.Element} Table component with expenses data
 */
const ExpenseTable = ({ 
  expenses, 
  handleDeleteClick, 
  isLoading, 
  expenseType,
  columns = [] 
}) => {
  // Calculate total from expenses array
  const totalAmount = expenses.reduce(
    (total, expense) => total + Number(expense.amount), 0
  );

  if (isLoading) {
    return (
      <div className="expense-loading">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading expenses...</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return <Alert variant="info">No {expenseType} expenses recorded yet.</Alert>;
  }

  return (
    <div className="table-responsive">
      <Table striped hover className="expense-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index} className={col.className || ''}>{col.title}</th>
            ))}
            <th className="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense.id}>
              {columns.map((col, index) => (
                <td key={index} className={col.className || ''}>
                  {col.render ? col.render(expense) : expense[col.dataKey]}
                </td>
              ))}
              <td className="actions-column">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDeleteClick(expense.id, expenseType)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="table-footer">
            <th colSpan={columns.length} className="text-end">Total:</th>
            <th className="text-end">
              {formatCurrency(totalAmount)}
            </th>
            <th></th>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
};

export default ExpenseTable; 