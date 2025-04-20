import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

// Store recently shown toast messages to prevent duplicates
const recentToasts = new Map();

// Default toast configuration
const defaultConfig = {
  position: "bottom-right",
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  closeButton: false,
  limit: 3,
  theme: 'light',
  // Accessibility options
  role: 'status',
  'aria-live': 'polite'
};

// Error toast config extends default with some specific settings
const errorConfig = {
  ...defaultConfig,
  autoClose: 4000, // Errors stay longer
  role: 'alert',
  'aria-live': 'assertive'
};

/**
 * Prevents duplicate toasts by tracking recent messages
 * @param {string} message - The toast message
 * @param {string} type - The type of toast (success, error, etc.)
 * @returns {boolean} - Whether this is a duplicate that should be prevented
 */
const isDuplicate = (message, type) => {
  const key = `${type}:${message}`;
  const now = Date.now();
  
  // Check if this message was shown recently (within 3 seconds)
  if (recentToasts.has(key)) {
    const timestamp = recentToasts.get(key);
    if (now - timestamp < 3000) {
      return true;
    }
  }
  
  // Not a duplicate or expired, update the timestamp
  recentToasts.set(key, now);
  
  // Clean up old entries occasionally
  if (recentToasts.size > 20) {
    for (const [key, timestamp] of recentToasts.entries()) {
      if (now - timestamp > 10000) {
        recentToasts.delete(key);
      }
    }
  }
  
  return false;
};

/**
 * Shows a success toast notification
 * @param {string} message - The message to display
 * @param {Object} customConfig - Optional custom configuration
 */
const showSuccess = (message, customConfig = {}) => {
  if (isDuplicate(message, 'success')) return;
  
  toast.success(message, {
    ...defaultConfig,
    ...customConfig,
    toastId: `success-${uuidv4().slice(0, 8)}` // Unique ID
  });
};

/**
 * Shows an error toast notification
 * @param {string} message - The message to display
 * @param {Object} customConfig - Optional custom configuration
 */
const showError = (message, customConfig = {}) => {
  if (isDuplicate(message, 'error')) return;
  
  toast.error(message, {
    ...errorConfig,
    ...customConfig,
    toastId: `error-${uuidv4().slice(0, 8)}` // Unique ID
  });
};

/**
 * Shows an info toast notification
 * @param {string} message - The message to display
 * @param {Object} customConfig - Optional custom configuration
 */
const showInfo = (message, customConfig = {}) => {
  if (isDuplicate(message, 'info')) return;
  
  toast.info(message, {
    ...defaultConfig,
    ...customConfig,
    toastId: `info-${uuidv4().slice(0, 8)}` // Unique ID
  });
};

/**
 * Shows a warning toast notification
 * @param {string} message - The message to display
 * @param {Object} customConfig - Optional custom configuration
 */
const showWarning = (message, customConfig = {}) => {
  if (isDuplicate(message, 'warning')) return;
  
  toast.warning(message, {
    ...defaultConfig,
    ...customConfig,
    autoClose: 3000, // Warnings stay a bit longer than success
    toastId: `warning-${uuidv4().slice(0, 8)}` // Unique ID
  });
};

/**
 * Update the global toast container configuration
 * Call this when you need to change toast defaults application-wide
 * @param {Object} config - The new configuration
 */
const updateGlobalConfig = (config) => {
  toast.configure(config);
};

/**
 * Dismiss all current toast notifications
 */
const dismissAll = () => {
  toast.dismiss();
};

// Main export is a simple function for the most common case
const showToast = (message, type = 'success', customConfig = {}) => {
  switch (type.toLowerCase()) {
    case 'error':
      showError(message, customConfig);
      break;
    case 'info':
      showInfo(message, customConfig);
      break;
    case 'warning':
      showWarning(message, customConfig);
      break;
    case 'success':
    default:
      showSuccess(message, customConfig);
      break;
  }
};

// Export both named functions and default function
export {
  showSuccess,
  showError,
  showInfo,
  showWarning,
  updateGlobalConfig,
  dismissAll,
  defaultConfig,
  errorConfig
};

export default showToast; 