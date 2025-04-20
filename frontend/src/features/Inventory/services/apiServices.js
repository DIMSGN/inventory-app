/**
 * Centralized API services exports
 */

import categoryService from './categoryService';
import productService from './productService';
import ruleService from './ruleService';

// Export all services
export {
  categoryService,
  productService,
  ruleService
};

// Default export for convenience
export default {
  categoryService,
  productService,
  ruleService
}; 