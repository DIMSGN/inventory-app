/**
 * Recipe calculation utility functions
 * These functions handle various calculations related to recipes,
 * including cost, profit, and profit margin calculations
 */

/**
 * Calculate the total cost of a recipe based on its ingredients
 * @param {Array} ingredients - List of recipe ingredients
 * @param {Array} products - List of available products
 * @returns {number} - Total cost of the recipe
 */
export const calculateTotalCost = (ingredients, products) => {
  if (!ingredients || !products) return 0;
  
  let cost = 0;
  
  ingredients.forEach(ingredient => {
    if (ingredient && ingredient.product_id && ingredient.amount) {
      const product = products.find(p => p.id === ingredient.product_id);
      if (product) {
        const unitPrice = product.purchase_price || 0;
        cost += unitPrice * ingredient.amount;
      }
    }
  });
  
  return cost;
};

/**
 * Calculate profit for a recipe
 * @param {number} salePrice - Sale price of the recipe
 * @param {number} totalCost - Total cost of the recipe
 * @returns {number} - Profit amount
 */
export const calculateProfit = (salePrice, totalCost) => {
  return salePrice - totalCost;
};

/**
 * Calculate profit margin as a percentage
 * @param {number} profit - Profit amount
 * @param {number} salePrice - Sale price of the recipe
 * @returns {number} - Profit margin percentage
 */
export const calculateProfitMargin = (profit, salePrice) => {
  if (salePrice <= 0) return 0;
  return (profit / salePrice) * 100;
};

/**
 * Format currency value for display
 * @param {number} value - Monetary value to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value) => {
  return `$${value.toFixed(2)}`;
};

export default {
  calculateTotalCost,
  calculateProfit,
  calculateProfitMargin,
  formatCurrency
}; 