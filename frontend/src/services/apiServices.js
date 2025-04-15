import axios from "axios";

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Log the API URL for debugging
console.log("API Base URL:", API_BASE_URL);

// Add axios interceptors for debugging with more detail
axios.interceptors.request.use(request => {
  console.log('Starting Request:', request.url);
  return request;
}, error => {
  console.error('Request Error:', error.message);
  return Promise.reject(error);
});

axios.interceptors.response.use(
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
    
    return Promise.reject(error);
  }
);

// Product Service
const PRODUCTS_URL = API_BASE_URL + "/products";
export const productService = {
    getBaseUrl: () => {
        return PRODUCTS_URL;
    },
    getProducts: (customUrl) => {
        console.log("Fetching products from:", customUrl || PRODUCTS_URL);
        return axios.get(customUrl || PRODUCTS_URL)
          .catch(err => {
            console.error("Error fetching products:", err.message);
            throw err;
          });
    },
    addProduct: (product) => {
        return axios.post(PRODUCTS_URL, product);
    },
    updateProduct: (id, product) => {
        return axios.put(`${PRODUCTS_URL}/${id}`, product);
    },
    deleteProduct: (id) => {
        console.log(`Sending delete request for product ID: ${id}`);
        return axios.delete(`${PRODUCTS_URL}/${id}`);
    },
};

// Rule Service
const RULES_URL = API_BASE_URL + "/rules";
export const ruleService = {
    getRules: () => {
        console.log("Fetching rules from:", RULES_URL);
        return axios.get(RULES_URL)
          .catch(err => {
            console.error("Error fetching rules:", err.message);
            throw err;
          });
    },
    addRule: (rule) => {
        console.log("Sending rule to backend:", rule); // Debugging log
        return axios.post(RULES_URL, rule);
    },
    updateRule: (id, rule) => {
        return axios.put(`${RULES_URL}/${id}`, rule);
    },
    deleteRule: (id) => {
        return axios.delete(`${RULES_URL}/${id}`);
    },
};

// Category Service
const CATEGORIES_URL = API_BASE_URL + "/categories";
export const categoryService = {
    getCategories: () => {
        console.log("Fetching categories from:", CATEGORIES_URL);
        return axios.get(CATEGORIES_URL)
          .catch(err => {
            console.error("Error fetching categories:", err.message);
            throw err;
          });
    },
    addCategory: (category) => {
        return axios.post(CATEGORIES_URL, { category });
    },
    deleteCategoryById: (id) => {
        return axios.delete(`${CATEGORIES_URL}/id/${id}`);
    },
    deleteCategoryByName: (name) => {
        return axios.delete(`${CATEGORIES_URL}/name/${name}`);
    },
};

// Default export all services together
const apiServices = {
    productService,
    ruleService,
    categoryService
};

export default apiServices; 