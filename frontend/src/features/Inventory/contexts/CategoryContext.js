import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { api } from '../services/api';
import { toast } from 'react-toastify';

// Initial state
const initialState = {
  categories: [],
  loading: false,
  error: null,
  selectedCategory: null
};

// Action types
const ACTION_TYPES = {
  FETCH_CATEGORIES_REQUEST: 'FETCH_CATEGORIES_REQUEST',
  FETCH_CATEGORIES_SUCCESS: 'FETCH_CATEGORIES_SUCCESS',
  FETCH_CATEGORIES_FAILURE: 'FETCH_CATEGORIES_FAILURE',
  ADD_CATEGORY_SUCCESS: 'ADD_CATEGORY_SUCCESS',
  UPDATE_CATEGORY_SUCCESS: 'UPDATE_CATEGORY_SUCCESS',
  DELETE_CATEGORY_SUCCESS: 'DELETE_CATEGORY_SUCCESS',
  SELECT_CATEGORY: 'SELECT_CATEGORY',
  CLEAR_SELECTED_CATEGORY: 'CLEAR_SELECTED_CATEGORY'
};

// Reducer function
const categoryReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.FETCH_CATEGORIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ACTION_TYPES.FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: action.payload,
        error: null
      };
    case ACTION_TYPES.FETCH_CATEGORIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case ACTION_TYPES.ADD_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: [...state.categories, action.payload],
        loading: false
      };
    case ACTION_TYPES.UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: state.categories.map(category => 
          category.id === action.payload.id ? action.payload : category
        ),
        selectedCategory: null,
        loading: false
      };
    case ACTION_TYPES.DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
        loading: false
      };
    case ACTION_TYPES.SELECT_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload
      };
    case ACTION_TYPES.CLEAR_SELECTED_CATEGORY:
      return {
        ...state,
        selectedCategory: null
      };
    default:
      return state;
  }
};

// Create context
const CategoryContext = createContext();

// Context provider component
export const CategoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(categoryReducer, initialState);

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    dispatch({ type: ACTION_TYPES.FETCH_CATEGORIES_REQUEST });
    try {
      const response = await api.categories.getAll();
      dispatch({ 
        type: ACTION_TYPES.FETCH_CATEGORIES_SUCCESS, 
        payload: response.data 
      });
    } catch (error) {
      dispatch({ 
        type: ACTION_TYPES.FETCH_CATEGORIES_FAILURE, 
        payload: error.message 
      });
      toast.error('Failed to fetch categories');
    }
  }, []);

  // Add a new category
  const addCategory = useCallback(async (categoryData) => {
    dispatch({ type: ACTION_TYPES.FETCH_CATEGORIES_REQUEST });
    try {
      const response = await api.categories.create(categoryData);
      dispatch({ 
        type: ACTION_TYPES.ADD_CATEGORY_SUCCESS, 
        payload: response.data 
      });
      toast.success('Category added successfully');
      return response.data;
    } catch (error) {
      dispatch({ 
        type: ACTION_TYPES.FETCH_CATEGORIES_FAILURE, 
        payload: error.message 
      });
      toast.error('Failed to add category');
      throw error;
    }
  }, []);

  // Update an existing category
  const updateCategory = useCallback(async (id, categoryData) => {
    dispatch({ type: ACTION_TYPES.FETCH_CATEGORIES_REQUEST });
    try {
      const response = await api.categories.update(id, categoryData);
      dispatch({ 
        type: ACTION_TYPES.UPDATE_CATEGORY_SUCCESS, 
        payload: response.data 
      });
      toast.success('Category updated successfully');
      return response.data;
    } catch (error) {
      dispatch({ 
        type: ACTION_TYPES.FETCH_CATEGORIES_FAILURE, 
        payload: error.message 
      });
      toast.error('Failed to update category');
      throw error;
    }
  }, []);

  // Delete a category
  const deleteCategory = useCallback(async (id, force = false) => {
    dispatch({ type: ACTION_TYPES.FETCH_CATEGORIES_REQUEST });
    try {
      await api.categories.delete(id, force);
      dispatch({ 
        type: ACTION_TYPES.DELETE_CATEGORY_SUCCESS, 
        payload: id 
      });
      toast.success('Category deleted successfully');
    } catch (error) {
      dispatch({ 
        type: ACTION_TYPES.FETCH_CATEGORIES_FAILURE, 
        payload: error.message 
      });
      
      // Check if this is a "has products" error and show force delete option
      if (error.response && error.response.status === 409) {
        toast.error(
          <div>
            {error.response.data.message}
            <button 
              onClick={() => deleteCategory(id, true)}
              style={{
                marginLeft: '10px',
                padding: '5px 10px',
                background: '#d32f2f',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Force Delete
            </button>
          </div>,
          { autoClose: false }
        );
      } else {
        toast.error('Failed to delete category');
      }
      throw error;
    }
  }, []);

  // Select a category for editing
  const selectCategory = useCallback((category) => {
    dispatch({ type: ACTION_TYPES.SELECT_CATEGORY, payload: category });
  }, []);

  // Clear selected category
  const clearSelectedCategory = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLEAR_SELECTED_CATEGORY });
  }, []);

  // Fetch categories on initial load
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const value = {
    categories: state.categories,
    loading: state.loading,
    error: state.error,
    selectedCategory: state.selectedCategory,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    selectCategory,
    clearSelectedCategory
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

CategoryProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Custom hook for using category context
export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategoryContext must be used within a CategoryProvider');
  }
  return context;
};

export default CategoryContext; 