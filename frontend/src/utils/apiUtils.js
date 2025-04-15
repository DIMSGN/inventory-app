import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

/**
 * Creates a full API URL by combining the base URL with the endpoint path
 * @param {string} endpoint - API endpoint path (e.g., '/products')
 * @returns {string} Full API URL
 */
const createApiUrl = (endpoint) => {
  // Ensure the endpoint starts with '/'
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${formattedEndpoint}`;
};

/**
 * Makes an API request with error handling
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {string} endpoint - API endpoint path
 * @param {Object} data - Request data (for POST, PUT)
 * @param {Object} options - Additional axios options
 * @returns {Promise<any>} Response data
 */
const apiRequest = async (method, endpoint, data = null, options = {}) => {
  try {
    const url = createApiUrl(endpoint);
    
    const config = {
      method,
      url,
      ...options
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`API ${method} request failed for ${endpoint}:`, error);
    
    // Format error message for better error handling
    const errorMessage = 
      error.response?.data?.error || 
      error.response?.data?.message || 
      error.message || 
      'An unknown error occurred';
      
    // Include status code and full response for debugging
    const enhancedError = new Error(errorMessage);
    enhancedError.status = error.response?.status;
    enhancedError.response = error.response?.data;
    enhancedError.originalError = error;
    
    throw enhancedError;
  }
};

/**
 * Performs a GET request to fetch data
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional axios options
 * @returns {Promise<any>} Response data
 */
export const fetchData = async (endpoint, options = {}) => {
  return apiRequest('get', endpoint, null, options);
};

/**
 * Performs a POST request to create data
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Data to create
 * @param {Object} options - Additional axios options
 * @returns {Promise<any>} Response data
 */
export const createData = async (endpoint, data, options = {}) => {
  return apiRequest('post', endpoint, data, options);
};

/**
 * Performs a PUT request to update data
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Data to update
 * @param {Object} options - Additional axios options
 * @returns {Promise<any>} Response data
 */
export const updateData = async (endpoint, data, options = {}) => {
  return apiRequest('put', endpoint, data, options);
};

/**
 * Performs a DELETE request to delete data
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional axios options
 * @returns {Promise<any>} Response data
 */
export const deleteData = async (endpoint, options = {}) => {
  return apiRequest('delete', endpoint, null, options);
};

// Export a default object with all methods
const apiUtils = {
  fetchData,
  createData,
  updateData,
  deleteData
};

export default apiUtils;