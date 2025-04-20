import axios from 'axios';
import { toast } from 'react-toastify';
import { config } from '../config';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Handle forbidden access
      toast.error('You do not have permission to perform this action');
    } else if (error.response?.status === 404) {
      // Handle not found
      toast.error('Resource not found');
    } else if (error.response?.status === 409 && error.response?.data?.forceDeleteAvailable) {
      // Handle conflict with force delete option
      toast.error(
        <div>
          {message}
          <button 
            onClick={() => {
              const url = error.config.url;
              const id = url.split('/').pop();
              const entityType = url.includes('categories') ? 'categories' : 'products';
              
              // Call the delete endpoint with force=true
              apiClient.delete(`/${entityType}/${id}?force=true`)
                .then(() => {
                  toast.success(`${entityType.slice(0, -1)} deleted successfully`);
                  // Refresh the page or update state as needed
                  window.location.reload();
                })
                .catch((err) => {
                  toast.error(`Error force deleting: ${err.message}`);
                });
            }}
            className="force-delete-btn"
          >
            Force Delete
          </button>
        </div>,
        { autoClose: false, closeOnClick: false }
      );
    } else {
      // Handle general errors
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Product API services
const products = {
  getAll: () => apiClient.get('/products'),
  getById: (id) => apiClient.get(`/products/${id}`),
  create: (data) => apiClient.post('/products', data),
  update: (id, data) => apiClient.put(`/products/${id}`, data),
  delete: (id) => apiClient.delete(`/products/${id}`),
  getExpiring: () => apiClient.get('/products/expiring'),
  getByCategoryId: (categoryId) => apiClient.get(`/products/category/${categoryId}`)
};

// Category API services
const categories = {
  getAll: () => apiClient.get('/categories'),
  getById: (id) => apiClient.get(`/categories/${id}`),
  create: (data) => apiClient.post('/categories', data),
  update: (id, data) => apiClient.put(`/categories/${id}`, data),
  delete: (id, force = false) => apiClient.delete(`/categories/${id}`, { params: { force } })
};

// Supplier API services
const suppliers = {
  getAll: () => apiClient.get('/suppliers'),
  getById: (id) => apiClient.get(`/suppliers/${id}`),
  create: (data) => apiClient.post('/suppliers', data),
  update: (id, data) => apiClient.put(`/suppliers/${id}`, data),
  delete: (id) => apiClient.delete(`/suppliers/${id}`)
};

// User API services
const users = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.put('/users/profile', data)
};

// Dashboard API services
const dashboard = {
  getStats: () => apiClient.get('/dashboard/stats'),
  getRecentActivity: () => apiClient.get('/dashboard/recent-activity')
};

// Invoice API services
const invoices = {
  getAll: () => apiClient.get('/invoices'),
  getById: (id) => apiClient.get(`/invoices/${id}`),
  create: (data) => apiClient.post('/invoices', data),
  update: (id, data) => apiClient.put(`/invoices/${id}`, data),
  delete: (id) => apiClient.delete(`/invoices/${id}`)
};

// Rules API services
const rules = {
  getAll: () => apiClient.get('/rules'),
  getById: (id) => apiClient.get(`/rules/${id}`),
  create: (data) => apiClient.post('/rules', data),
  update: (id, data) => apiClient.put(`/rules/${id}`, data),
  delete: (id) => apiClient.delete(`/rules/${id}`)
};

// Bar recipes API services
const recipes = {
  getAll: () => apiClient.get('/recipes'),
  getById: (id) => apiClient.get(`/recipes/${id}`),
  create: (data) => apiClient.post('/recipes', data),
  update: (id, data) => apiClient.put(`/recipes/${id}`, data),
  delete: (id) => apiClient.delete(`/recipes/${id}`)
};

// Export the API services
export const api = {
  products,
  categories,
  suppliers,
  users,
  dashboard,
  invoices,
  rules,
  recipes
};

export default apiClient; 