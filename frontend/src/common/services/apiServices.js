import axios from "axios";

// Use relative URL to avoid CORS issues
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Log the API URL for debugging
console.log("API Base URL:", API_BASE_URL);
console.log("Environment:", process.env.NODE_ENV);

// Configure axios defaults
axios.defaults.timeout = 15000; // 15 seconds timeout
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Create an axios instance with custom config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  // Don't send credentials for CORS
  withCredentials: false,
  // Retry logic built in
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Resolve only if status is 2xx/3xx/4xx
  },
  // Set headers for CORS
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Test connectivity to API on startup
console.log("Testing API connectivity...");
fetch(`${API_BASE_URL}/health`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("API Health Check Successful:", data);
  })
  .catch(error => {
    console.error("API Health Check Failed:", error.message);
  });

// Add axios interceptors for debugging with more detail
apiClient.interceptors.request.use(request => {
  console.log('Starting Request:', request.url, 'Full URL:', request.baseURL + request.url);
  return request;
}, error => {
  console.error('Request Error:', error.message);
  return Promise.reject(error);
});

apiClient.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  error => {
    // Log full error details for better debugging
    console.error('Axios Error:', {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      // Show full stack trace in development
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
    
    // Log detailed network errors
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error details:', { 
        message: 'Cannot connect to the server. Is your backend running?',
        url: error.config?.url,
        baseURL: API_BASE_URL
      });
    }
    
    // Add retry logic for network errors
    if (error.code === 'ERR_NETWORK' && error.config && !error.config.__isRetryRequest) {
      console.log('Retrying request after network error...');
      error.config.__isRetryRequest = true;
      return new Promise(resolve => setTimeout(() => resolve(apiClient(error.config)), 2000));
    }
    
    return Promise.reject(error);
  }
);

// Health check function to verify API connectivity
export const checkApiHealth = () => {
  return apiClient.get('/health')
    .then(response => {
      console.log('API Health Check:', response.data);
      return response.data;
    })
    .catch(error => {
      console.error('API Health Check Failed:', error.message);
      throw error;
    });
};

// Product Service
const PRODUCTS_URL = "/products";
export const productService = {
    getBaseUrl: () => {
        return `${API_BASE_URL}${PRODUCTS_URL}`;
    },
    getProducts: (customUrl) => {
        const url = customUrl || PRODUCTS_URL;
        console.log("Fetching products from:", `${API_BASE_URL}${url}`);
        return apiClient.get(url)
          .catch(err => {
            console.error("Error fetching products:", err.message);
            throw err;
          });
    },
    addProduct: (product) => {
        console.log("Adding new product:", product);
        
        // Create a clean copy of the product data
        const cleanedProduct = { ...product };
        
        // Format date values to YYYY-MM-DD format (MySQL DATE format)
        if (cleanedProduct.received_date) {
            console.log('Original received_date:', cleanedProduct.received_date);
            // Check if it's already in ISO format and needs converting
            if (typeof cleanedProduct.received_date === 'string' && cleanedProduct.received_date.includes('T')) {
                // Extract just the date part from the ISO string
                cleanedProduct.received_date = cleanedProduct.received_date.split('T')[0];
            }
            console.log('Formatted received_date:', cleanedProduct.received_date);
        }
        
        if (cleanedProduct.expiration_date) {
            console.log('Original expiration_date:', cleanedProduct.expiration_date);
            // Check if it's already in ISO format and needs converting
            if (typeof cleanedProduct.expiration_date === 'string' && cleanedProduct.expiration_date.includes('T')) {
                // Extract just the date part from the ISO string
                cleanedProduct.expiration_date = cleanedProduct.expiration_date.split('T')[0];
            }
            console.log('Formatted expiration_date:', cleanedProduct.expiration_date);
        }
        
        console.log("Final product data being sent to API:", cleanedProduct);
        
        return apiClient.post(PRODUCTS_URL, cleanedProduct)
          .catch(err => {
            console.error("Error adding product:", err.message);
            throw err;
          });
    },
    updateProduct: (id, product) => {
        console.log(`Sending product update request for ID: ${id}`, product);
        
        // Make sure we're not sending undefined values
        const cleanedProduct = Object.fromEntries(
            Object.entries(product).filter(([_, v]) => v !== undefined)
        );
        
        // Ensure numeric values are properly formatted
        if (cleanedProduct.purchase_price !== undefined) {
            console.log('Original purchase_price:', cleanedProduct.purchase_price, 'type:', typeof cleanedProduct.purchase_price);
            cleanedProduct.purchase_price = parseFloat(cleanedProduct.purchase_price);
            console.log('Formatted purchase_price:', cleanedProduct.purchase_price, 'type:', typeof cleanedProduct.purchase_price);
        }
        
        if (cleanedProduct.price !== undefined && cleanedProduct.price !== null) {
            console.log('Original price:', cleanedProduct.price, 'type:', typeof cleanedProduct.price);
            cleanedProduct.price = parseFloat(cleanedProduct.price);
            console.log('Formatted price:', cleanedProduct.price, 'type:', typeof cleanedProduct.price);
        }
        
        if (cleanedProduct.amount !== undefined) {
            console.log('Original amount:', cleanedProduct.amount, 'type:', typeof cleanedProduct.amount);
            cleanedProduct.amount = parseFloat(cleanedProduct.amount);
            console.log('Formatted amount:', cleanedProduct.amount, 'type:', typeof cleanedProduct.amount);
        }
        
        // Format date values to YYYY-MM-DD format (MySQL DATE format)
        if (cleanedProduct.received_date) {
            console.log('Original received_date:', cleanedProduct.received_date);
            // Check if it's already in ISO format and needs converting
            if (typeof cleanedProduct.received_date === 'string' && cleanedProduct.received_date.includes('T')) {
                // Extract just the date part from the ISO string
                cleanedProduct.received_date = cleanedProduct.received_date.split('T')[0];
            }
            console.log('Formatted received_date:', cleanedProduct.received_date);
        }
        
        if (cleanedProduct.expiration_date) {
            console.log('Original expiration_date:', cleanedProduct.expiration_date);
            // Check if it's already in ISO format and needs converting
            if (typeof cleanedProduct.expiration_date === 'string' && cleanedProduct.expiration_date.includes('T')) {
                // Extract just the date part from the ISO string
                cleanedProduct.expiration_date = cleanedProduct.expiration_date.split('T')[0];
            }
            console.log('Formatted expiration_date:', cleanedProduct.expiration_date);
        }
        
        console.log('Final product data being sent to API:', cleanedProduct);
        
        return apiClient.put(`${PRODUCTS_URL}/${id}`, cleanedProduct)
          .then(response => {
            console.log("Product update API response:", response.data);
            if (response.status !== 200) {
              console.warn(`Unexpected status code ${response.status} when updating product`);
            }
            return response;
          })
          .catch(err => {
            console.error(`Error updating product ID ${id}:`, err.response?.data || err.message);
            console.error("Request that caused error:", cleanedProduct);
            throw err;
          });
    },
    deleteProduct: (id) => {
        console.log(`Deleting product with ID: ${id}`);
        return apiClient.delete(`${PRODUCTS_URL}/${id}`)
          .then(response => {
            console.log(`Delete product ID ${id} response:`, response.data);
            return response;
          })
          .catch(err => {
            console.error(`Error deleting product ID ${id}:`, err.response?.data || err.message);
            throw err;
          });
    },
};

// Rule Service
const RULES_URL = "/rules";
export const ruleService = {
    getRules: () => {
        console.log("Fetching rules from:", `${API_BASE_URL}${RULES_URL}`);
        return apiClient.get(RULES_URL)
          .catch(err => {
            console.error("Error fetching rules:", err.message);
            throw err;
          });
    },
    addRule: (rule) => {
        console.log("Sending rule to backend:", rule); // Debugging log
        return apiClient.post(RULES_URL, rule);
    },
    updateRule: (id, rule) => {
        return apiClient.put(`${RULES_URL}/${id}`, rule);
    },
    deleteRule: (id) => {
        return apiClient.delete(`${RULES_URL}/${id}`);
    },
};

// Category Service
const CATEGORIES_URL = "/categories";
export const categoryService = {
    getCategories: () => {
        console.log("Fetching categories from:", `${API_BASE_URL}${CATEGORIES_URL}`);
        return apiClient.get(CATEGORIES_URL)
          .catch(err => {
            console.error("Error fetching categories:", err.message);
            throw err;
          });
    },
    addCategory: (category) => {
        console.log("Adding category with value:", category);
        console.log("Request payload:", { category });
        
        // Make sure we're sending { category: "value" } format as expected by backend
        return apiClient.post(CATEGORIES_URL, { category })
            .then(response => {
                console.log("Add category response:", response);
                return response;
            })
            .catch(err => {
                console.error("Error adding category - FULL ERROR:", err);
                console.error("Error response data:", err.response?.data);
                console.error("Error status:", err.response?.status);
                throw err;
            });
    },
    updateCategory: (id, categoryName) => {
        console.log(`Updating category ID ${id} to name: ${categoryName}`);
        return apiClient.put(`${CATEGORIES_URL}/${id}`, { name: categoryName })
          .then(response => {
            console.log(`Category update response:`, response.data);
            return response;
          })
          .catch(err => {
            console.error(`Error updating category ID ${id}:`, err.response?.data || err.message);
            throw err;
          });
    },
    deleteCategory: (id) => {
        console.log(`Deleting category with ID: ${id}`);
        
        // Important: This matches the backend route format /api/categories/id/:categoryId
        return apiClient.delete(`${CATEGORIES_URL}/id/${id}`)
          .then(response => {
            console.log(`Category delete response:`, response.data);
            return response;
          })
          .catch(err => {
            // Include more detailed error logging
            console.error(`Error deleting category ID ${id} - FULL ERROR:`, err);
            console.error(`Response status:`, err.response?.status);
            console.error(`Response data:`, err.response?.data);
            console.error(`Request URL:`, `${API_BASE_URL}${CATEGORIES_URL}/id/${id}`);
            throw err;
          });
    },
    deleteCategoryById: (id) => {
        console.log(`Deleting category by ID: ${id}`);
        return apiClient.delete(`${CATEGORIES_URL}/id/${id}`)
          .then(response => {
            console.log(`Category delete by ID response:`, response.data);
            return response;
          })
          .catch(err => {
            console.error(`Error deleting category ID ${id}:`, err.response?.data || err.message);
            throw err;
          });
    },
    deleteCategoryByName: (name) => {
        // Ensure the name is properly encoded for the URL
        const encodedName = encodeURIComponent(name);
        console.log(`Deleting category by name: ${name} (encoded: ${encodedName})`);
        
        return apiClient.delete(`${CATEGORIES_URL}/name/${encodedName}`)
          .then(response => {
            console.log(`Category delete by name response:`, response.data);
            return response;
          })
          .catch(err => {
            console.error(`Error deleting category name ${name}:`, err.response?.data || err.message);
            console.error(`Request URL:`, `${API_BASE_URL}${CATEGORIES_URL}/name/${encodedName}`);
            throw err;
          });
    },
    // Force delete a category by ID, clearing any product associations first
    forceCategoryDeleteById: (id) => {
        console.log(`Force deleting category by ID: ${id}`);
        return apiClient.delete(`${CATEGORIES_URL}/id/${id}?force=true`)
          .then(response => {
            console.log(`Force delete category response:`, response.data);
            return response;
          })
          .catch(err => {
            console.error(`Error force deleting category ID ${id}:`, err.response?.data || err.message);
            console.error(`Request URL:`, `${API_BASE_URL}${CATEGORIES_URL}/id/${id}?force=true`);
            throw err;
          });
    },
};

// Supplier Service
const SUPPLIERS_URL = "/suppliers";
export const supplierService = {
    getSuppliers: () => {
        console.log("Fetching suppliers from:", `${API_BASE_URL}${SUPPLIERS_URL}`);
        return apiClient.get(SUPPLIERS_URL)
          .catch(err => {
            console.error("Error fetching suppliers:", err.message);
            throw err;
          });
    },
    getSupplierById: (id) => {
        return apiClient.get(`${SUPPLIERS_URL}/${id}`)
          .catch(err => {
            console.error(`Error fetching supplier ID ${id}:`, err.message);
            throw err;
          });
    },
    createSupplier: (supplier) => {
        return apiClient.post(SUPPLIERS_URL, supplier)
          .catch(err => {
            console.error("Error creating supplier:", err.message);
            throw err;
          });
    },
    updateSupplier: (id, supplier) => {
        return apiClient.put(`${SUPPLIERS_URL}/${id}`, supplier)
          .catch(err => {
            console.error(`Error updating supplier ID ${id}:`, err.message);
            throw err;
          });
    },
    deleteSupplier: (id) => {
        return apiClient.delete(`${SUPPLIERS_URL}/${id}`)
          .catch(err => {
            console.error(`Error deleting supplier ID ${id}:`, err.message);
            throw err;
          });
    }
};

// Invoice Service
const INVOICES_URL = "/invoices";
export const invoiceService = {
    getInvoices: () => {
        return apiClient.get(INVOICES_URL)
          .catch(err => {
            console.error("Error fetching invoices:", err.message);
            throw err;
          });
    },
    getInvoiceById: (id) => {
        return apiClient.get(`${INVOICES_URL}/${id}`)
          .catch(err => {
            console.error(`Error fetching invoice ID ${id}:`, err.message);
            throw err;
          });
    },
    createInvoice: (invoice) => {
        return apiClient.post(INVOICES_URL, invoice)
          .catch(err => {
            console.error("Error creating invoice:", err.message);
            throw err;
          });
    },
    updateInvoice: (id, invoice) => {
        return apiClient.put(`${INVOICES_URL}/${id}`, invoice)
          .catch(err => {
            console.error(`Error updating invoice ID ${id}:`, err.message);
            throw err;
          });
    },
    deleteInvoice: (id) => {
        return apiClient.delete(`${INVOICES_URL}/${id}`)
          .catch(err => {
            console.error(`Error deleting invoice ID ${id}:`, err.message);
            throw err;
          });
    }
};

// Sales Service
const SALES_URL = "/sales";
export const salesService = {
    getAllSales: () => {
        return apiClient.get(SALES_URL)
            .catch(err => {
                console.error("Error fetching all sales:", err.message);
                throw err;
            });
    },
    getDailySummary: () => {
        return apiClient.get(`${SALES_URL}/daily`)
            .catch(err => {
                console.error("Error fetching daily sales summary:", err.message);
                throw err;
            });
    },
    getMonthlySummary: () => {
        return apiClient.get(`${SALES_URL}/monthly`)
            .catch(err => {
                console.error("Error fetching monthly sales summary:", err.message);
                throw err;
            });
    },
    recordFoodSale: (sale) => {
        return apiClient.post(`${SALES_URL}/food`, sale)
            .catch(err => {
                console.error("Error recording food sale:", err.message);
                throw err;
            });
    },
    recordCoffeeSale: (sale) => {
        return apiClient.post(`${SALES_URL}/coffee`, sale)
            .catch(err => {
                console.error("Error recording coffee/beverage sale:", err.message);
                throw err;
            });
    },
    recordCocktailSale: (sale) => {
        return apiClient.post(`${SALES_URL}/cocktail`, sale)
            .catch(err => {
                console.error("Error recording cocktail sale:", err.message);
                throw err;
            });
    },
    recordDrinkSale: (sale) => {
        return apiClient.post(`${SALES_URL}/drink`, sale)
            .catch(err => {
                console.error("Error recording drink sale:", err.message);
                throw err;
            });
    }
};

// Expenses Service
const EXPENSES_URL = "/expenses";
export const expensesService = {
    getOperatingExpenses: () => {
        return apiClient.get(`${EXPENSES_URL}/operating`)
            .catch(err => {
                console.error("Error fetching operating expenses:", err.message);
                throw err;
            });
    },
    recordOperatingExpense: (expense) => {
        return apiClient.post(`${EXPENSES_URL}/operating`, expense)
            .catch(err => {
                console.error("Error recording operating expense:", err.message);
                throw err;
            });
    },
    deleteOperatingExpense: (id) => {
        return apiClient.delete(`${EXPENSES_URL}/operating/${id}`)
            .catch(err => {
                console.error("Error deleting operating expense:", err.message);
                throw err;
            });
    },
    getPayrollExpenses: () => {
        return apiClient.get(`${EXPENSES_URL}/payroll`)
            .catch(err => {
                console.error("Error fetching payroll expenses:", err.message);
                throw err;
            });
    },
    recordPayrollExpense: (expense) => {
        return apiClient.post(`${EXPENSES_URL}/payroll`, expense)
            .catch(err => {
                console.error("Error recording payroll expense:", err.message);
                throw err;
            });
    },
    deletePayrollExpense: (id) => {
        return apiClient.delete(`${EXPENSES_URL}/payroll/${id}`)
            .catch(err => {
                console.error("Error deleting payroll expense:", err.message);
                throw err;
            });
    }
};

// Recipe Service
const RECIPES_URL = "/recipes";
export const recipeService = {
    getRecipes: () => {
        return apiClient.get(RECIPES_URL)
            .then(response => response.data)
            .catch(err => {
                console.error("Error fetching recipes:", err.message);
                throw err;
            });
    },
    getRecipeById: (id) => {
        return apiClient.get(`${RECIPES_URL}/${id}`)
            .then(response => response.data)
            .catch(err => {
                console.error(`Error fetching recipe ${id}:`, err.message);
                throw err;
            });
    },
    createRecipe: (recipeData) => {
        return apiClient.post(RECIPES_URL, recipeData)
            .then(response => response.data)
            .catch(err => {
                console.error("Error creating recipe:", err.message);
                throw err;
            });
    },
    updateRecipe: (id, recipeData) => {
        return apiClient.put(`${RECIPES_URL}/${id}`, recipeData)
            .then(response => response.data)
            .catch(err => {
                console.error(`Error updating recipe ${id}:`, err.message);
                throw err;
            });
    },
    deleteRecipe: (id) => {
        return apiClient.delete(`${RECIPES_URL}/${id}`)
            .then(response => response.data)
            .catch(err => {
                console.error(`Error deleting recipe ${id}:`, err.message);
                throw err;
            });
    }
};

// Default export all services together
const apiServices = {
    health: checkApiHealth,
    productService,
    ruleService,
    categoryService,
    supplierService,
    invoiceService,
    salesService,
    expensesService,
    recipeService
};

export default apiServices; 