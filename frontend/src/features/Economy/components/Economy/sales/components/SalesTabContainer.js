import React from 'react';
import { Alert } from 'react-bootstrap';

/**
 * Sales Tab Container Component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Tab content
 * @param {string} props.error - Error message
 * @param {string} props.success - Success message
 * @param {Function} props.onErrorDismiss - Error dismiss handler
 * @param {Function} props.onSuccessDismiss - Success dismiss handler
 * @returns {JSX.Element} SalesTabContainer component
 */
const SalesTabContainer = ({ 
  children, 
  error, 
  success, 
  onErrorDismiss, 
  onSuccessDismiss 
}) => {
  return (
    <>
      {error && (
        <Alert variant="danger" dismissible onClose={onErrorDismiss}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" dismissible onClose={onSuccessDismiss}>
          {success}
        </Alert>
      )}
      
      {children}
    </>
  );
};

export default SalesTabContainer; 