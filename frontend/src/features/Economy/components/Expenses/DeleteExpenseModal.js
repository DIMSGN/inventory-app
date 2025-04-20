import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

/**
 * Modal component for confirming expense deletion
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.showModal - Controls modal visibility
 * @param {Function} props.handleClose - Function to close the modal
 * @param {Function} props.handleConfirmDelete - Function to execute on delete confirmation
 * @param {boolean} props.isDeleting - Flag indicating if delete operation is in progress
 * @param {string} props.expenseType - Type of expense being deleted ('operating' or 'payroll')
 * @returns {JSX.Element} Delete confirmation modal
 */
const DeleteExpenseModal = ({
  showModal,
  handleClose,
  handleConfirmDelete,
  isDeleting,
  expenseType
}) => {
  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          <FaTrash className="me-2" /> Delete Expense
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this {expenseType} expense?</p>
        <p className="text-danger">This action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleConfirmDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete Expense'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteExpenseModal; 