/**
 * Form validation utility functions
 */

/**
 * Validates if a value is not empty
 * @param {*} value - The value to validate
 * @returns {boolean} Whether the value is not empty
 */
export const isNotEmpty = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (typeof value === 'number') return true;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return !!value;
};

/**
 * Validates if a value is a valid email
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if a value is a number
 * @param {*} value - The value to validate
 * @returns {boolean} Whether the value is a number
 */
export const isNumber = (value) => {
  if (value === null || value === undefined) return false;
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Validates if a value is a positive number
 * @param {*} value - The value to validate
 * @returns {boolean} Whether the value is a positive number
 */
export const isPositiveNumber = (value) => {
  return isNumber(value) && parseFloat(value) > 0;
};

/**
 * Validates if a value is a non-negative number (zero or positive)
 * @param {*} value - The value to validate
 * @returns {boolean} Whether the value is a non-negative number
 */
export const isNonNegativeNumber = (value) => {
  return isNumber(value) && parseFloat(value) >= 0;
};

/**
 * Validates if a value has a minimum length
 * @param {string} value - The value to validate
 * @param {number} length - The minimum length
 * @returns {boolean} Whether the value has the minimum length
 */
export const hasMinLength = (value, length) => {
  if (!value) return false;
  return String(value).length >= length;
};

/**
 * Validates if a value has a maximum length
 * @param {string} value - The value to validate
 * @param {number} length - The maximum length
 * @returns {boolean} Whether the value has the maximum length
 */
export const hasMaxLength = (value, length) => {
  if (!value) return true;
  return String(value).length <= length;
};

/**
 * Creates a validation object with error messages for a form
 * @param {Object} checks - Object with field keys and validation results
 * @returns {Object} Object with field keys and error messages
 */
export const createValidationErrors = (checks) => {
  const errors = {};
  
  Object.keys(checks).forEach(field => {
    const { valid, message } = checks[field];
    if (!valid) {
      errors[field] = message;
    }
  });
  
  return errors;
};

export default {
  isNotEmpty,
  isValidEmail,
  isNumber,
  isPositiveNumber,
  isNonNegativeNumber,
  hasMinLength,
  hasMaxLength,
  createValidationErrors
}; 