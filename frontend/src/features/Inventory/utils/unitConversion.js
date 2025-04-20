/**
 * Utility for converting between different units of measurement
 */

import moment from 'moment';

/**
 * Converts a quantity from one unit to another
 * @param {number} quantity - The quantity to convert
 * @param {object} fromUnit - The unit object to convert from
 * @param {object} toUnit - The unit object to convert to
 * @returns {number} The converted quantity
 */
export const convertQuantity = (quantity, fromUnit, toUnit) => {
  if (!fromUnit || !toUnit) {
    return quantity;
  }

  // If units are the same, no conversion needed
  if (fromUnit.id === toUnit.id) {
    return quantity;
  }

  // Convert to base unit first (using fromUnit conversion factor)
  const baseQuantity = quantity * fromUnit.conversion_factor;
  
  // Then convert from base unit to target unit
  return baseQuantity / toUnit.conversion_factor;
};

/**
 * Formats a monetary value as currency
 * @param {number} value - The value to format
 * @param {string} currency - The currency symbol to use
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = '$') => {
  if (value === null || value === undefined) return '-';
  const amount = parseFloat(value);
  if (isNaN(amount)) return '-';
  
  return `${currency}${amount.toFixed(2)}`;
};

/**
 * Calculates the unit price based on purchase price and amount
 * @param {number} price - The purchase price
 * @param {number} amount - The amount
 * @param {string} unitName - The unit name
 * @returns {object} Unit price data
 */
export const calculateUnitPrice = (price, amount, unitName) => {
  if (!price || !amount || amount === 0) {
    return { 
      value: 0, 
      display: '-' 
    };
  }
  
  const unitPrice = price / amount;
  return {
    value: unitPrice,
    display: `${formatCurrency(unitPrice)}${unitName ? ` / ${unitName}` : ''}`
  };
};

/**
 * Formats a quantity with its unit for display
 * @param {number} quantity - The quantity to format
 * @param {string} unitName - The name of the unit
 * @returns {string} Formatted quantity with unit
 */
export const formatQuantityWithUnit = (quantity, unitName) => {
  if (!quantity && quantity !== 0) return 'N/A';
  
  // Format number to have at most 2 decimal places
  const formattedQuantity = Number.isInteger(quantity) 
    ? quantity.toString() 
    : quantity.toFixed(2).replace(/\.?0+$/, '');
  
  return `${formattedQuantity} ${unitName || ''}`;
};

export default {
  convertQuantity,
  formatQuantityWithUnit,
  formatCurrency,
  calculateUnitPrice
}; 