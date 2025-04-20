import { useMemo, useCallback } from 'react';
import { useAppContext } from '../../../common/contexts/AppContext';

/**
 * Custom hook for filtering and applying inventory rules
 * 
 * This hook provides functionality for filtering products based on rules
 * and determining which rules apply to a specific product/amount.
 * 
 * @returns {Object} Rule filtering methods
 */
const useRuleFiltering = () => {
  const { rules } = useAppContext();

  /**
   * Check if a specific rule applies to a product with its current amount
   * 
   * @param {Object} rule - The rule to check
   * @param {number} amount - Current amount of the product
   * @returns {boolean} Whether the rule applies
   */
  const doesRuleApply = useCallback((rule, amount) => {
    if (!rule || amount === undefined) return false;
    
    const ruleAmount = parseFloat(rule.amount);
    const currentAmount = parseFloat(amount);
    
    switch (rule.comparison) {
      case '=':
        return currentAmount === ruleAmount;
      case '<':
        return currentAmount < ruleAmount;
      case '>':
        return currentAmount > ruleAmount;
      case '<=':
        return currentAmount <= ruleAmount;
      case '>=':
        return currentAmount >= ruleAmount;
      default:
        return false;
    }
  }, []);

  /**
   * Get applicable rules for a specific product based on its current amount
   * 
   * @param {string|number} productId - ID of the product
   * @param {number} amount - Current amount of the product
   * @returns {Array} List of rules that apply to the product
   */
  const getApplicableRules = useCallback((productId, amount) => {
    if (!productId || !rules || amount === undefined) return [];
    
    return rules
      .filter(rule => rule.product_id.toString() === productId.toString())
      .filter(rule => doesRuleApply(rule, amount));
  }, [rules, doesRuleApply]);

  /**
   * Get the color to display for a product based on its applicable rules
   * If multiple rules apply, the first one is used (consider adding priority)
   * 
   * @param {string|number} productId - ID of the product
   * @param {number} amount - Current amount of the product
   * @returns {string|null} Color code or null if no rules apply
   */
  const getProductColorByRules = useCallback((productId, amount) => {
    const applicableRules = getApplicableRules(productId, amount);
    return applicableRules.length > 0 ? applicableRules[0].color : null;
  }, [getApplicableRules]);

  /**
   * Filter an array of products based on whether they have applicable rules
   * 
   * @param {Array} products - List of products to filter
   * @param {boolean} onlyWithApplicableRules - If true, return only products with applicable rules
   * @returns {Array} Filtered list of products
   */
  const filterProductsByRules = useCallback((products, onlyWithApplicableRules = false) => {
    if (!products || !Array.isArray(products)) return [];
    
    if (!onlyWithApplicableRules) return products;
    
    return products.filter(product => {
      const applicableRules = getApplicableRules(product.product_id, product.amount);
      return applicableRules.length > 0;
    });
  }, [getApplicableRules]);

  /**
   * Sort products by rule severity (most severe first)
   * Could be extended with rule priority in the future
   * 
   * @param {Array} products - List of products to sort
   * @returns {Array} Sorted list of products
   */
  const sortProductsByRuleSeverity = useCallback((products) => {
    if (!products || !Array.isArray(products)) return [];
    
    return [...products].sort((a, b) => {
      const aRules = getApplicableRules(a.product_id, a.amount);
      const bRules = getApplicableRules(b.product_id, b.amount);
      
      // Products with rules come first
      if (aRules.length && !bRules.length) return -1;
      if (!aRules.length && bRules.length) return 1;
      
      // Both have rules or both don't have rules - maintain original order
      return 0;
    });
  }, [getApplicableRules]);

  return {
    doesRuleApply,
    getApplicableRules,
    getProductColorByRules,
    filterProductsByRules,
    sortProductsByRuleSeverity
  };
};

export default useRuleFiltering; 