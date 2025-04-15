import React from 'react';
import styles from './ConfirmationModal.module.css';

/**
 * A reusable confirmation modal for confirming actions like deletions
 * 
 * @param {Object} props Component props
 * @param {string} props.title Modal title
 * @param {string} props.message Confirmation message
 * @param {Function} props.onConfirm Function to call when user confirms
 * @param {Function} props.onCancel Function to call when user cancels
 * @param {string} [props.confirmButtonText="Confirm"] Text for the confirm button
 * @param {string} [props.cancelButtonText="Cancel"] Text for the cancel button
 * @param {string} [props.confirmButtonVariant="danger"] Variant for confirm button (danger, success, etc.)
 */
const ConfirmationModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  confirmButtonVariant = "danger"
}) => {
  // Prevent clicks within the modal from closing it
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.modalBackdrop} onClick={onCancel}>
      <div className={styles.modalContent} onClick={handleModalClick}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
        </div>
        <div className={styles.modalBody}>
          <p>{message}</p>
        </div>
        <div className={styles.modalFooter}>
          <button 
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onCancel}
          >
            {cancelButtonText}
          </button>
          <button 
            className={`${styles.button} ${styles[`${confirmButtonVariant}Button`]}`}
            onClick={onConfirm}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 