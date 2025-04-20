import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import '../../../styles/expenses.css';

/**
 * Operating expense form component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.formData - Form data object
 * @param {Function} props.setFormData - Form data setter function
 * @param {Function} props.onSubmit - Form submit handler
 * @param {boolean} props.isSubmitting - Submission in progress flag
 * @param {string} props.error - Error message
 * @param {string} props.success - Success message
 * @returns {JSX.Element} OperatingExpenseForm component
 */
const OperatingExpenseForm = ({
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
        <Form.Label className="expense-form-label">Description</Form.Label>
        <Form.Control
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter expense description"
          required
        />
      </Form.Group>

      <Form.Group className="expense-form-group">
        <Form.Label className="expense-form-label">Category</Form.Label>
        <Form.Control
          as="select"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          <option value="Rent">Rent</option>
          <option value="Utilities">Utilities</option>
          <option value="Supplies">Supplies</option>
          <option value="Marketing">Marketing</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Insurance">Insurance</option>
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
        {isSubmitting ? 'Recording...' : 'Record Expense'}
      </Button>
      
      {error && <Alert variant="danger" className="expense-alert mt-3">{error}</Alert>}
      {success && <Alert variant="success" className="expense-alert mt-3">{success}</Alert>}
    </Form>
  );
};

export default OperatingExpenseForm; 