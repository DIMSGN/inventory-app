/**
 * Opens the rule modal for creating or editing a rule
 * 
 * @param {Object} product - The product to create a rule for
 * @param {Function} setCurrentProduct - Function to set the current product
 * @param {Function} setIsRuleModalOpen - Function to open/close the rule modal
 */
export const openRuleModal = (product, setCurrentProduct, setIsRuleModalOpen) => {
  console.log("openRuleModal called with product:", product);
  
  // If product is provided, set it as the current product
  if (product) {
    setCurrentProduct(product);
  }
  
  // Open the rule modal
  setIsRuleModalOpen(true);
}; 