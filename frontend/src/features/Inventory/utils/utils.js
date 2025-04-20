/**
 * General utility functions for the Inventory feature
 */

import { toast } from 'react-toastify';
import { standardToastConfig } from './toastConfig';
import moment from 'moment';

/**
 * Shows an error message as a toast notification
 * @param {string} message - The error message to display
 */
export const showError = (message) => {
  toast.error(message, standardToastConfig);
};

/**
 * Shows a success message as a toast notification
 * @param {string} message - The success message to display
 */
export const showSuccess = (message) => {
  toast.success(message, standardToastConfig);
};

/**
 * Formats a date string to a more readable format
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

/**
 * Formats a monetary value with 2 decimal places
 * @param {number} value - The value to format
 * @param {boolean} includeCurrency - Whether to include the currency symbol
 * @returns {string} Formatted price
 */
export const formatPrice = (value, includeCurrency = true) => {
  const price = parseFloat(value);
  if (isNaN(price)) return includeCurrency ? '$0.00' : '0.00';
  
  const formatted = price.toFixed(2);
  return includeCurrency ? `$${formatted}` : formatted;
};

/**
 * Checks if a date is in the past (expired)
 * @param {string} dateString - The date string to check
 * @returns {boolean} True if the date is in the past
 */
export const isExpired = (dateString) => {
  if (!dateString) return false;
  return moment(dateString).isBefore(moment().startOf('day'));
};

/**
 * Checks if a date is within the expiring soon threshold (within 7 days)
 * @param {string} dateString - The date string to check
 * @param {number} daysThreshold - Number of days for the threshold
 * @returns {boolean} True if the date is expiring soon
 */
export const isExpiringSoon = (dateString, daysThreshold = 7) => {
  if (!dateString) return false;
  const date = moment(dateString);
  const today = moment().startOf('day');
  const expiryThreshold = moment().add(daysThreshold, 'days').startOf('day');
  
  return date.isAfter(today) && date.isBefore(expiryThreshold);
};

/**
 * Generates a random color
 * @returns {string} Random hex color
 */
export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/**
 * Truncates a text string to a specified length and adds ellipsis
 * @param {string} text - The text to truncate
 * @param {number} length - The maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export default {
  showError,
  showSuccess,
  formatDate,
  formatPrice,
  isExpired,
  isExpiringSoon,
  getRandomColor,
  truncateText
}; 