import axios from "axios";

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL;

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