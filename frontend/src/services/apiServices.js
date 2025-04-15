import axios from "axios";

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Log the API URL for debugging
console.log("API Base URL:", API_BASE_URL);

// Add axios interceptors for debugging
axios.interceptors.request.use(request => {
  console.log('Starting Request:', request.url);
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('Axios Error:', {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
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
        return axios.get(customUrl || PRODUCTS_URL);
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
        return axios.get(RULES_URL);
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
        return axios.get(CATEGORIES_URL);
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