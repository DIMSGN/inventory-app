/**
 * Utility functions for handling unit conversions
 */

// Base unit conversion mapping
const BASE_UNITS = {
  'g': 'WEIGHT',
  'kg': 'WEIGHT',
  'ml': 'VOLUME',
  'lt': 'VOLUME',
  'pcs': 'COUNT',
  'piece': 'COUNT',
  'pieces': 'COUNT'
};

// Conversion factors to base unit
const CONVERSION_FACTORS = {
  'g': 1,     // 1g = 1g (base unit)
  'kg': 1000, // 1kg = 1000g
  'ml': 1,    // 1ml = 1ml (base unit)
  'lt': 1000, // 1lt = 1000ml
  'pcs': 1,   // 1pc = 1pc (base unit)
  'piece': 1,
  'pieces': 1
};

/**
 * Convert a weight value between units
 * @param {number} value - Value to convert
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {number} Converted value
 */
export const convertWeight = (value, fromUnit, toUnit) => {
  if (!value) return 0;
  
  // Convert to base unit (grams)
  const baseValue = value * (CONVERSION_FACTORS[fromUnit] || 1);
  
  // Convert from base unit to target unit
  return baseValue / (CONVERSION_FACTORS[toUnit] || 1);
};

/**
 * Convert a volume value between units
 * @param {number} value - Value to convert
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {number} Converted value
 */
export const convertVolume = (value, fromUnit, toUnit) => {
  if (!value) return 0;
  
  // Convert to base unit (ml)
  const baseValue = value * (CONVERSION_FACTORS[fromUnit] || 1);
  
  // Convert from base unit to target unit
  return baseValue / (CONVERSION_FACTORS[toUnit] || 1);
};

/**
 * Convert between different types of units (weight/volume/count)
 * @param {number} value - Value to convert
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {number} Converted value or original if conversion not possible
 */
export const convertBetweenTypes = (value, fromUnit, toUnit) => {
  const fromType = BASE_UNITS[fromUnit];
  const toType = BASE_UNITS[toUnit];
  
  if (!fromType || !toType) {
    return value; // Cannot convert unknown units
  }
  
  if (fromType === toType) {
    // Same type, use appropriate conversion
    switch (fromType) {
      case 'WEIGHT':
        return convertWeight(value, fromUnit, toUnit);
      case 'VOLUME':
        return convertVolume(value, fromUnit, toUnit);
      case 'COUNT':
        return value; // Direct conversion for count units
      default:
        return value;
    }
  }
  
  // Different types - conversion not possible without density info
  return value;
};

/**
 * Calculate the cost of an ingredient with unit conversion
 * @param {Object} ingredient - The ingredient object
 * @param {Object} product - The product object with unit and pricing info
 * @returns {number} The calculated cost
 */
export const calculateIngredientCost = (ingredient, product) => {
  if (!product || !ingredient || !ingredient.amount || ingredient.amount <= 0) return 0;
  if (!product.purchase_price) return 0;
  
  const amountNum = parseFloat(ingredient.amount);
  if (isNaN(amountNum)) return 0;
  
  const purchasePrice = parseFloat(product.purchase_price);
  if (isNaN(purchasePrice)) return 0;
  
  // If product has pieces_per_package, it's a packaged product
  if (product.pieces_per_package && product.pieces_per_package > 0) {
    // Calculate price per piece
    const pricePerPiece = purchasePrice / parseFloat(product.pieces_per_package);
    
    // If the units match or are both COUNT type units
    if (ingredient.unit_id === product.unit_id || 
        (BASE_UNITS[ingredient.unit_id] === 'COUNT' && BASE_UNITS[product.unit_id] === 'COUNT')) {
      return amountNum * pricePerPiece;
    }
    
    // If units don't match and can't be converted, return best estimate
    return amountNum * pricePerPiece;
  }
  
  // Regular product (not packaged)
  // If units match, simple calculation
  if (ingredient.unit_id === product.unit_id) {
    // The amount is directly proportional to the product amount
    const productAmount = parseFloat(product.amount) || 1;
    return (amountNum / productAmount) * purchasePrice;
  }
  
  // Units don't match - try to convert
  try {
    const convertedAmount = convertBetweenTypes(amountNum, ingredient.unit_id, product.unit_id);
    const productAmount = parseFloat(product.amount) || 1;
    return (convertedAmount / productAmount) * purchasePrice;
  } catch (error) {
    console.error('Error converting units for cost calculation:', error);
    // Fallback - assume direct proportion
    const productAmount = parseFloat(product.amount) || 1;
    return (amountNum / productAmount) * purchasePrice;
  }
};

/**
 * Format a currency amount
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: EUR)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'EUR') => {
  if (amount === undefined || amount === null) return '-';
  
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format a unit display with appropriate symbol
 * @param {number} value - The value to display
 * @param {string} unitName - The name of the unit
 * @returns {string} Formatted display string
 */
export const formatUnitDisplay = (value, unitName) => {
  if (!unitName) return value.toString();
  
  // Format based on unit type
  const lowerUnit = unitName.toLowerCase();
  
  switch (lowerUnit) {
    case 'kg':
    case 'kilogram':
    case 'kilograms':
      return `${value} kg`;
    case 'g':
    case 'gram':
    case 'grams':
      return `${value} g`;
    case 'l':
    case 'lt':
    case 'liter':
    case 'litre':
      return `${value} L`;
    case 'ml':
    case 'milliliter':
    case 'millilitre':
      return `${value} ml`;
    case 'pcs':
    case 'piece':
    case 'pieces':
      return value === 1 ? `${value} piece` : `${value} pieces`;
    default:
      return `${value} ${unitName}`;
  }
};

/**
 * Calculate unit price (e.g., price per kg) from total price and amount
 * @param {number} price - The total price
 * @param {number} amount - The amount 
 * @param {string} unitName - The unit name
 * @returns {Object} Object with unit price and formatted display
 */
export const calculateUnitPrice = (price, amount, unitName) => {
  if (!price || !amount || amount <= 0) {
    return { value: 0, display: '-' };
  }
  
  const unitPrice = price / amount;
  return {
    value: unitPrice,
    display: `${formatCurrency(unitPrice)}/${unitName}`
  };
};

// Export conversion utilities
const unitConversionUtils = {
  convertWeight,
  convertVolume,
  convertBetweenTypes,
  calculateIngredientCost,
  formatCurrency
};

export default unitConversionUtils; 