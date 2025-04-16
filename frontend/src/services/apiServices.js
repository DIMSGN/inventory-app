import axios from "axios";

// Use relative URL to avoid CORS issues
const API_BASE_URL = '/api';

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
        return apiClient.post(PRODUCTS_URL, product);
    },
    updateProduct: (id, product) => {
        return apiClient.put(`${PRODUCTS_URL}/${id}`, product);
    },
    deleteProduct: (id) => {
        console.log(`Sending delete request for product ID: ${id}`);
        return apiClient.delete(`${PRODUCTS_URL}/${id}`);
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
        return apiClient.post(CATEGORIES_URL, { category });
    },
    deleteCategoryById: (id) => {
        return apiClient.delete(`${CATEGORIES_URL}/id/${id}`);
    },
    deleteCategoryByName: (name) => {
        return apiClient.delete(`${CATEGORIES_URL}/name/${name}`);
    },
};

// Default export all services together
const apiServices = {
    health: checkApiHealth,
    productService,
    ruleService,
    categoryService
};

export default apiServices; 