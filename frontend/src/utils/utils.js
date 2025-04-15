import { showSuccess, showError } from "../services/toastService";

/**
 * Shows a success toast notification
 * @param {string} message - Message to display
 */
export const showSuccessToast = (message) => {
  showSuccess(message);
};

/**
 * Shows an error toast notification
 * @param {string} message - Message to display
 */
export const showErrorToast = (message) => {
  showError(message);
};

/**
 * Determines the background color for a product row based on applicable rules
 * @param {Object} product - The product to check
 * @param {Array} rules - Array of rules to evaluate
 * @returns {string} CSS background color
 */
export const getRowColor = (product, rules) => {
  return '#ffffff'; // Default white background
};

// For backward compatibility
export { showSuccess, showError }; 