import { API_URL } from '../config';
import { checkApiHealth } from './api';

/**
 * API Services Initialization Module
 * 
 * This module initializes the API services and performs basic health checking.
 * It no longer contains service implementations which are now in separate files:
 * - productService.js
 * - categoryService.js
 * - ruleService.js
 * - recipeService.js
 * - supplierService.js
 * - userService.js
 * - invoiceService.js
 * - dashboardService.js
 */

// Log the API configuration on startup
console.log("API Configuration:", {
  url: API_URL,
  environment: process.env.NODE_ENV
});

// Initialize API health check, but don't block app startup
if (process.env.NODE_ENV !== 'test') {
  setTimeout(() => {
    try {
      checkApiHealth()
        .then(result => {
          if (result.status === 'ok') {
            console.log("✅ API is available and ready");
          } else {
            console.warn("⚠️ API health check failed. Some features may not work correctly.");
          }
        })
        .catch(() => {
          console.warn("⚠️ API health check error. Backend may be unavailable.");
        });
    } catch (error) {
      console.warn("⚠️ Failed to perform API health check due to a client-side error.");
    }
  }, 2000);
}

// Export a simple API status check function that can be used elsewhere
export const isApiAvailable = async () => {
  try {
    const result = await checkApiHealth();
    return result.status === 'ok';
  } catch (error) {
    return false;
  }
};

export default {
  isApiAvailable,
  checkApiHealth
}; 