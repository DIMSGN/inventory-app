import React from 'react';
import { Card } from 'react-bootstrap';
import '../../../styles/expenses.css';

/**
 * Reusable card component for expense sections
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.children - Card content
 * @returns {JSX.Element} Card component with consistent styling
 */
const ExpenseCard = ({ icon, title, children }) => {
  return (
    <Card className="expense-card mb-4">
      <Card.Header>
        <h5 className="mb-0 d-flex align-items-center">
          {icon && <span className="me-2">{icon}</span>}
          {title}
        </h5>
      </Card.Header>
      <Card.Body>
        {children}
      </Card.Body>
    </Card>
  );
};

export default ExpenseCard; 