import React, { useEffect } from "react";
import styles from "./Modal.module.css";
import { FaTimes } from 'react-icons/fa';

/**
 * Reusable Modal component
 * @param {Object} props
 * @param {boolean} [props.isOpen=true] - Whether the modal is open
 * @param {string} props.title - Modal title
 * @param {function} props.onClose - Function to call when modal is closed
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.className - Additional class name for the modal
 */
const Modal = ({ isOpen = true, title, onClose, children, className = "" }) => {
  // Prevent scrolling on the body when modal is open
  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling on the body when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Modal can only be closed using the close button
  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${className}`}>
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
};

export default Modal; 