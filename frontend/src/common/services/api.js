import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../config';

/**
 * Core API client for all service requests
 * Handles interceptors, error handling, authentication and retries
 */

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Resolve only if status is 2xx/3xx/4xx
  }
});

// Add request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add debug logging in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('Request:', config.method?.toUpperCase(), config.url);
    }
    
    // Add authentication token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Add debug logging in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    // Log detailed error information
    console.error('API Error:', {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    // Add retry logic for network errors
    if (error.code === 'ERR_NETWORK' && error.config && !error.config.__isRetryRequest) {
      console.log('Retrying request after network error...');
      error.config.__isRetryRequest = true;
      return new Promise(resolve => setTimeout(() => resolve(apiClient(error.config)), 2000));
    }
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast.error('Your session has expired. Please login again.');
    } else if (error.response?.status === 403) {
      // Handle forbidden access
      toast.error('You do not have permission to perform this action');
    } else if (error.response?.status === 404) {
      // Handle not found
      toast.error('Resource not found');
    } else {
      // Handle general errors (only in UI contexts, not during initialization)
      const message = error.response?.data?.message || error.message || 'An error occurred';
      if (document.readyState === 'complete') {
        toast.error(message);
      }
    }
    
    return Promise.reject(error);
  }
);

// Health check utility function
export const checkApiHealth = () => {
  return apiClient.get('/health')
    .then(response => {
      console.log('API Health Check Successful');
      return { status: 'ok', data: response.data };
    })
    .catch(error => {
      console.error('API Health Check Failed:', error.message);
      // Don't log the full error object to avoid console noise in production
      return { status: 'error', message: error.message };
    });
};

// Run health check on startup, but don't block app initialization
if (process.env.NODE_ENV !== 'test') {
  setTimeout(() => {
    checkApiHealth().then(status => {
      if (status.status === 'error') {
        console.warn('API is not available. Some features may not work correctly.');
      }
    });
  }, 2000);
}

export default apiClient; 