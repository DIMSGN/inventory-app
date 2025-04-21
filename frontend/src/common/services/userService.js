import apiClient from './api';
import { toastService } from './index';

const { showSuccess } = toastService;

const AUTH_URL = '/auth';
const USERS_URL = '/users';

/**
 * Service for user authentication and profile management
 */
const userService = {
  /**
   * Authenticate user with credentials
   * @param {Object} credentials - User login credentials (email/password)
   * @returns {Promise} Promise with user data and token
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post(`${AUTH_URL}/login`, credentials);
      
      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        // Store minimal user info if available
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify({
            id: response.data.user.id,
            name: response.data.user.name,
            role: response.data.user.role
          }));
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Promise with registration result
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post(`${AUTH_URL}/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  /**
   * Log out the current user
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
  
  /**
   * Get the current user's profile
   * @returns {Promise} Promise with user profile data
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get(`${USERS_URL}/profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
  
  /**
   * Update the current user's profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Promise with updated profile
   */
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put(`${USERS_URL}/profile`, profileData);
      showSuccess('Profile updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  
  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  /**
   * Get current user data from localStorage
   * @returns {Object|null} User data or null if not logged in
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default userService; 