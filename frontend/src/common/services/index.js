import api from './api';
import apiServices from './apiServices';
import toastService from './toastService';

// Import individual services
import productService from './productService';
import categoryService from './categoryService';
import ruleService from './ruleService';
import recipeService from './recipeService';
import salesService from './salesService';
import expensesService from './expensesService';
import supplierService from './supplierService';
import invoiceService from './invoiceService';
import unitsService from './unitsService';

/**
 * Services export
 * 
 * We have two different services implementations:
 * 1. Individual service files (productService.js, etc.)
 * 2. Combined services in apiServices.js
 * 
 * This export prefers the individual service files when available,
 * but falls back to apiServices for other services.
 */
export {
  // Core utilities
  api,
  apiServices,
  toastService,
  
  // Preferred individual services
  productService,
  categoryService,
  ruleService,
  recipeService,
  salesService,
  expensesService,
  supplierService,
  invoiceService,
  unitsService
}; 