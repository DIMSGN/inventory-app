import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import '../../../styles/expenses.css';

/**
 * Payroll expense form component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.formData - Form data object
 * @param {Function} props.setFormData - Form data setter function
 * @param {Function} props.onSubmit - Form submit handler
 * @param {boolean} props.isSubmitting - Submission in progress flag
 * @param {string} props.error - Error message
 * @param {string} props.success - Success message
 * @returns {JSX.Element} PayrollExpenseForm component
 */
const PayrollExpenseForm = ({
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  error,
  success
}) => {
  /**
   * Handle form input changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="expense-form-group">
        <Form.Label className="expense-form-label">Date</Form.Label>
        <Form.Control
          type="date"
          name="expense_date"
          value={formData.expense_date}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="expense-form-group">
        <Form.Label className="expense-form-label">Employee Name</Form.Label>
        <Form.Control
          type="text"
          name="employee_name"
          value={formData.employee_name}
          onChange={handleChange}
          placeholder="Enter employee name"
          required
        />
      </Form.Group>

      <Form.Group className="expense-form-group">
        <Form.Label className="expense-form-label">Department</Form.Label>
        <Form.Control
          as="select"
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
        >
          <option value="">Select a department</option>
          <option value="Kitchen">Kitchen</option>
          <option value="Service">Service</option>
          <option value="Management">Management</option>
          <option value="Housekeeping">Housekeeping</option>
          <option value="Administrative">Administrative</option>
          <option value="Other">Other</option>
        </Form.Control>
      </Form.Group>

      <Form.Group className="expense-form-group">
        <Form.Label className="expense-form-label">Amount</Form.Label>
        <Form.Control
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Enter amount"
          step="0.01"
          min="0"
          required
        />
      </Form.Group>

      <Button 
        variant="primary" 
        type="submit" 
        disabled={isSubmitting}
        className="expense-submit-btn"
      >
        {isSubmitting ? 'Recording...' : 'Record Payroll'}
      </Button>
      
      {error && <Alert variant="danger" className="expense-alert mt-3">{error}</Alert>}
      {success && <Alert variant="success" className="expense-alert mt-3">{success}</Alert>}
    </Form>
  );
};

export default PayrollExpenseForm; 