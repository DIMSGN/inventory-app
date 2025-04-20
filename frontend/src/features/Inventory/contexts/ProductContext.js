import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { api } from '../services/api';

// Initial state
const initialState = {
  products: [],
  filteredProducts: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    expiringSoon: false,
    expired: false,
  },
};

// Action types
const ACTIONS = {
  FETCH_PRODUCTS_REQUEST: 'FETCH_PRODUCTS_REQUEST',
  FETCH_PRODUCTS_SUCCESS: 'FETCH_PRODUCTS_SUCCESS',
  FETCH_PRODUCTS_FAILURE: 'FETCH_PRODUCTS_FAILURE',
  ADD_PRODUCT_SUCCESS: 'ADD_PRODUCT_SUCCESS',
  UPDATE_PRODUCT_SUCCESS: 'UPDATE_PRODUCT_SUCCESS',
  DELETE_PRODUCT_SUCCESS: 'DELETE_PRODUCT_SUCCESS',
  SET_FILTERS: 'SET_FILTERS',
  APPLY_FILTERS: 'APPLY_FILTERS',
};

// Reducer function
const productReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };
    case ACTIONS.FETCH_PRODUCTS_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        products: action.payload,
        filteredProducts: applyFiltersToProducts(action.payload, state.filters),
      };
    case ACTIONS.FETCH_PRODUCTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ACTIONS.ADD_PRODUCT_SUCCESS:
      const updatedProducts = [...state.products, action.payload];
      return { 
        ...state, 
        products: updatedProducts,
        filteredProducts: applyFiltersToProducts(updatedProducts, state.filters),
      };
    case ACTIONS.UPDATE_PRODUCT_SUCCESS:
      const updatedProductsList = state.products.map(product => 
        product.product_id === action.payload.product_id ? action.payload : product
      );
      return { 
        ...state, 
        products: updatedProductsList,
        filteredProducts: applyFiltersToProducts(updatedProductsList, state.filters),
      };
    case ACTIONS.DELETE_PRODUCT_SUCCESS:
      const filteredProducts = state.products.filter(
        product => product.product_id !== action.payload
      );
      return { 
        ...state, 
        products: filteredProducts,
        filteredProducts: applyFiltersToProducts(filteredProducts, state.filters),
      };
    case ACTIONS.SET_FILTERS:
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload },
      };
    case ACTIONS.APPLY_FILTERS:
      return {
        ...state,
        filteredProducts: applyFiltersToProducts(state.products, state.filters),
      };
    default:
      return state;
  }
};

// Helper function to apply filters to products
const applyFiltersToProducts = (products, filters) => {
  return products.filter(product => {
    // Search filter
    const matchesSearch = filters.search 
      ? product.product_name.toLowerCase().includes(filters.search.toLowerCase())
      : true;

    // Category filter
    const matchesCategory = filters.category 
      ? product.category_id === parseInt(filters.category) 
      : true;

    // Expiring soon filter (30 days)
    const now = new Date();
    const expiryDate = new Date(product.expiry_date);
    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    const matchesExpiringSoon = filters.expiringSoon ? isExpiringSoon : true;

    // Expired filter
    const isExpired = daysUntilExpiry <= 0;
    const matchesExpired = filters.expired ? isExpired : true;

    return (
      matchesSearch && 
      matchesCategory && 
      (filters.expiringSoon ? matchesExpiringSoon : true) && 
      (filters.expired ? matchesExpired : true)
    );
  });
};

// Create context
const ProductContext = createContext();

// Provider component
export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    dispatch({ type: ACTIONS.FETCH_PRODUCTS_REQUEST });
    try {
      const response = await api.products.getAll();
      dispatch({ 
        type: ACTIONS.FETCH_PRODUCTS_SUCCESS, 
        payload: response.data 
      });
    } catch (error) {
      dispatch({ 
        type: ACTIONS.FETCH_PRODUCTS_FAILURE, 
        payload: error.message 
      });
    }
  }, []);

  // Add product
  const addProduct = useCallback(async (productData) => {
    try {
      const response = await api.products.create(productData);
      dispatch({ 
        type: ACTIONS.ADD_PRODUCT_SUCCESS, 
        payload: response.data 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  // Update product
  const updateProduct = useCallback(async (id, productData) => {
    try {
      const response = await api.products.update(id, productData);
      dispatch({ 
        type: ACTIONS.UPDATE_PRODUCT_SUCCESS, 
        payload: response.data 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  // Delete product
  const deleteProduct = useCallback(async (id) => {
    try {
      await api.products.delete(id);
      dispatch({ 
        type: ACTIONS.DELETE_PRODUCT_SUCCESS, 
        payload: id 
      });
    } catch (error) {
      throw error;
    }
  }, []);

  // Set filters
  const setFilters = useCallback((filters) => {
    dispatch({ 
      type: ACTIONS.SET_FILTERS, 
      payload: filters 
    });
    dispatch({ type: ACTIONS.APPLY_FILTERS });
  }, []);

  // Fetch products on initial load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Context value
  const value = {
    products: state.products,
    filteredProducts: state.filteredProducts,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setFilters,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

ProductProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use product context
export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

export default ProductContext; 