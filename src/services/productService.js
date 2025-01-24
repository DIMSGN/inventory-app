// Import the axios module to make HTTP requests
import axios from "axios";

// Define the base URL for the product API
const API_URL = "http://localhost:5000/api/products";

/**
 * productService
 * This service provides functions to interact with the product API.
 * It includes methods to get all products, add a new product, update an existing product, and delete a product.
 */
const productService = {
    /**
     * Get all products
     * This function sends a GET request to fetch all products from the API.
     * @returns {Promise} - A promise that resolves with the response data.
     */
    getProducts: () => {
        return axios.get(API_URL);
    },

    /**
     * Add a new product
     * This function sends a POST request to add a new product to the API.
     * @param {Object} product - The product object to be added.
     * @returns {Promise} - A promise that resolves with the response data.
     */
    addProduct: (product) => {
        return axios.post(API_URL, product);
    },

    /**
     * Update an existing product
     * This function sends a PUT request to update an existing product in the API.
     * @param {number} id - The ID of the product to be updated.
     * @param {Object} product - The updated product object.
     * @returns {Promise} - A promise that resolves with the response data.
     */
    updateProduct: (id, product) => {
        return axios.put(`${API_URL}/${id}`, product);
    },

    /**
     * Delete a product
     * This function sends a DELETE request to delete a product from the API.
     * @param {number} id - The ID of the product to be deleted.
     * @returns {Promise} - A promise that resolves with the response data.
     */
    deleteProduct: (id) => {
        return axios.delete(`${API_URL}/${id}`);
    },
};

// Export the productService object to be used in other parts of the application
export default productService;

/**
 * Explanation of Imports:
 * - axios: This module is used to make HTTP requests from the browser to the server.
 * 
 * Why it’s implemented this way:
 * - The axios module is used to simplify making HTTP requests to the product API.
 * - The API_URL constant defines the base URL for the product API, making it easy to update the URL if needed.
 * - The productService object provides a set of methods to interact with the product API, encapsulating the API calls and making them reusable throughout the application.
 * - The getProducts method sends a GET request to fetch all products from the API.
 * - The addProduct method sends a POST request to add a new product to the API.
 * - The updateProduct method sends a PUT request to update an existing product in the API.
 * - The deleteProduct method sends a DELETE request to delete a product from the API.
 * - The productService object is exported to be used in other parts of the application, allowing for easy integration of product-related API calls.
 */
