import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { productService, ruleService, categoryService } from "../services/apiServices";
import { showSuccess, showError } from "../services/toastService";
import axios from "axios";

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  // State for products
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // State for rules
  const [rules, setRules] = useState([]);
  const [currentRule, setCurrentRule] = useState(null);
  
  // State for categories
  const [categories, setCategories] = useState([]);
  
  // State for UI
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilterOptions, setSelectedFilterOptions] = useState([]);
  
  // Data fetching functions
  const fetchProducts = useCallback(async (forceClearCache = false) => {
    setIsLoading(true);
    try {
      const response = await productService.getProducts();
      const data = response.data;
      setProducts(data);
      setFilteredProducts(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showError('Error fetching products: ' + error.message);
    }
  }, []);

  const fetchRules = useCallback(async () => {
    try {
      const fetchedRules = await ruleService.getRules();
      setRules(fetchedRules.data);
      localStorage.setItem('rules', JSON.stringify(fetchedRules.data));
      return fetchedRules.data;
    } catch (error) {
      console.error("Error fetching rules:", error);
      showError("Failed to load rules");
      return [];
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const fetchedCategories = await categoryService.getCategories();
      setCategories(fetchedCategories.data);
      localStorage.setItem('categories', JSON.stringify(fetchedCategories.data));
      return fetchedCategories.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      showError("Failed to load categories");
      return [];
    }
  }, []);
  
  // New function to reload all data
  const reloadAllData = useCallback(async (forceClearCache = false) => {
    setIsLoading(true);
    try {
      console.log("Reloading all application data, force clear cache:", forceClearCache);
      
      // Fetch data sequentially to reduce network load and improve initial render
      // First fetch products as they're most important for UI
      await fetchProducts(forceClearCache);
      
      // Then fetch rules and categories in parallel as they're less critical
      await Promise.all([
        fetchRules(),
        fetchCategories()
      ]);
      
      showSuccess("Data refreshed successfully");
    } catch (error) {
      console.error("Error reloading data:", error);
      showError("Failed to refresh data");
    } finally {
      setIsLoading(false);
    }
  }, [fetchProducts, fetchRules, fetchCategories]);

  // Filtering function (optimized)
  const handleFilterChange = useCallback((selectedOptions) => {
    if (!selectedOptions || selectedOptions.length === 0) {
      setFilteredProducts(products);
      return;
    }

    if (selectedOptions.some(option => option.value === "all")) {
      setFilteredProducts(products);
      return;
    }

    const selectedCategories = selectedOptions.map(option => option.value);
    
    // Find products that match the selected categories, check both string and number types
    const filtered = products.filter(product => {
      // Handle case where product.category might be a category ID (number) or name (string)
      const productCategory = product.category;
      
      // Check if the product's category (either ID or name) is in the selected categories
      return selectedCategories.includes(productCategory) || 
             // If productCategory is numeric, convert selected categories to numbers and check
             (typeof productCategory === 'number' && 
              selectedCategories.some(c => parseInt(c) === productCategory));
    });
    
    setFilteredProducts(filtered);
  }, [products]);
  
  // Fetch data on mount
  useEffect(() => {
    // Log any cached products on initial load for debugging
    try {
      const cachedProducts = JSON.parse(localStorage.getItem('products') || '[]');
      console.log(`Initial load - ${cachedProducts.length} products in localStorage cache:`);
      if (cachedProducts.length > 0) {
        const cachedIds = cachedProducts.map(p => p.product_id).join(', ');
        console.log(`Cached product IDs: ${cachedIds}`);
      }
    } catch (error) {
      console.error("Error reading localStorage on init:", error);
    }
    
    // Clear all cached data on initial load to ensure fresh state
    localStorage.removeItem('products');
    localStorage.removeItem('rules');
    localStorage.removeItem('categories');
    
    console.log("Initial app load - fetching fresh data from server");
    reloadAllData(true);
  }, [reloadAllData]);
  
  // Apply filters when filter options or products change
  useEffect(() => {
    handleFilterChange(selectedFilterOptions);
  }, [products, selectedFilterOptions, handleFilterChange]);

  // Product operations
  const addProduct = useCallback(async (product) => {
    try {
      const newProduct = await productService.addProduct(product);
      await reloadAllData(); // Reload all data after adding product
      showSuccess("Product added successfully");
      return newProduct.data;
    } catch (error) {
      console.error("Error adding product:", error);
      showError(error.message || "Failed to add product");
      return null;
    }
  }, [reloadAllData]);

  const updateProduct = useCallback(async (id, updatedProduct) => {
    try {
      const result = await productService.updateProduct(id, updatedProduct);
      await reloadAllData(); // Reload all data after updating product
      setEditingProduct(null);
      showSuccess("Product updated successfully");
      return result.data;
    } catch (error) {
      console.error("Error updating product:", error);
      showError(error.message || "Failed to update product");
      return null;
    }
  }, [reloadAllData]);

  const deleteProduct = useCallback(async (id) => {
    try {
      setIsLoading(true);
      console.log(`Attempting to delete product with ID: ${id}`);
      const response = await productService.deleteProduct(id);
      
      console.log(`Delete response:`, response);
      
      if (response.status === 200) {
        console.log(`Product deleted successfully: ${id}`);
        
        // Perform a direct check on the server to verify deletion
        console.log("Verifying product deletion by direct database check");
        try {
          const verifyResponse = await axios.get(`${productService.getBaseUrl()}/${id}?verify=true`);
          console.log("Verification response:", verifyResponse);
          if (verifyResponse.data && verifyResponse.data.exists) {
            console.error("VERIFICATION FAILED: Product still exists in database!");
            showError("Warning: Product may not be permanently deleted");
          } else {
            console.log("VERIFICATION SUCCESS: Product confirmed deleted from database");
          }
        } catch (verifyError) {
          if (verifyError.response && verifyError.response.status === 404) {
            console.log("VERIFICATION SUCCESS: Product not found (expected 404)");
          } else {
            console.error("Error during deletion verification:", verifyError);
          }
        }
        
        // Update local state immediately for UI responsiveness
        setProducts(prevProducts => prevProducts.filter(p => p.product_id !== id));
        setFilteredProducts(prevFiltered => prevFiltered.filter(p => p.product_id !== id));
        
        // Clear product from localStorage to ensure it's not restored on refresh
        try {
          const cachedProducts = JSON.parse(localStorage.getItem('products') || '[]');
          const updatedCache = cachedProducts.filter(p => p.product_id !== id);
          localStorage.setItem('products', JSON.stringify(updatedCache));
          console.log(`Updated localStorage after deletion`);
        } catch (cacheError) {
          console.error(`Error updating localStorage:`, cacheError);
        }
        
        // Force reload data from server with cache clearing
        await fetchProducts(true);
        
        showSuccess("Product deleted successfully");
        return true;
      } else {
        console.error("Unexpected response status:", response.status);
        showError("Failed to delete product: Unexpected response");
        return false;
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      // Check for specific error messages from the server
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.details || 
                          error.message || 
                          "Failed to delete product";
      showError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchProducts]);

  // Rule operations
  const addRule = useCallback(async (rule) => {
    try {
      const newRule = await ruleService.addRule(rule);
      await reloadAllData(); // Reload all data after adding rule
      showSuccess("Rule added successfully");
      return newRule.data;
    } catch (error) {
      console.error("Error adding rule:", error);
      showError(error.message || "Failed to add rule");
      return null;
    }
  }, [reloadAllData]);

  const updateRule = useCallback(async (rule) => {
    try {
      const result = await ruleService.updateRule(rule.id, rule);
      await reloadAllData(); // Reload all data after updating rule
      showSuccess("Rule updated successfully");
      return result.data;
    } catch (error) {
      console.error("Error updating rule:", error);
      showError(error.message || "Failed to update rule");
      return null;
    }
  }, [reloadAllData]);

  const deleteRule = useCallback(async (id) => {
    try {
      await ruleService.deleteRule(id);
      await reloadAllData(); // Reload all data after deleting rule
      showSuccess("Rule deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting rule:", error);
      showError(error.message || "Failed to delete rule");
      return false;
    }
  }, [reloadAllData]);

  // Category operations
  const addCategory = useCallback(async (category) => {
    try {
      const newCategory = await categoryService.addCategory(category);
      await reloadAllData(); // Reload all data after adding category
      showSuccess("Category added successfully");
      return newCategory.data;
    } catch (error) {
      console.error("Error adding category:", error);
      showError(error.message || "Failed to add category");
      return null;
    }
  }, [reloadAllData]);

  const updateCategory = useCallback(async (id, updatedCategory) => {
    try {
      const result = await categoryService.updateCategory(id, updatedCategory);
      await reloadAllData(); // Reload all data after updating category
      showSuccess("Category updated successfully");
      return result.data;
    } catch (error) {
      console.error("Error updating category:", error);
      showError(error.message || "Failed to update category");
      return null;
    }
  }, [reloadAllData]);

  const deleteCategory = useCallback(async (categoryId, callback = () => {}) => {
    try {
      setIsLoading(true);
      await categoryService.deleteCategoryById(categoryId);
      
      // If delete was successful, update the local state
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      
      showSuccess("Category deleted successfully");
      if (callback) callback();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        // Handle the specific error for categories with associated products
        if (error.response.data.error.includes('associated products')) {
          showError("Cannot delete category that has associated products");
        } else {
          showError(error.response.data.error);
        }
      } else {
        console.error('Error deleting category:', error);
        showError("Failed to delete category");
      }
    } finally {
      setIsLoading(false);
    }
  }, [setCategories, setIsLoading]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    // State
    products,
    filteredProducts,
    editingProduct,
    rules,
    currentRule,
    categories,
    isLoading,
    selectedFilterOptions,
    
    // Setters
    setEditingProduct,
    setFilteredProducts,
    setCurrentRule,
    setSelectedFilterOptions,
    setRules,
    setCategories,
    
    // Data operations
    fetchProducts,
    fetchRules,
    fetchCategories,
    reloadAllData,
    
    // Product operations
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Rule operations
    addRule,
    updateRule,
    deleteRule,
    
    // Category operations
    addCategory,
    updateCategory,
    deleteCategory,
    
    // Utility functions
    handleFilterChange
  }), [
    products, filteredProducts, editingProduct, rules, currentRule, 
    categories, isLoading, selectedFilterOptions, setEditingProduct, 
    setFilteredProducts, setCurrentRule, setSelectedFilterOptions, 
    setRules, setCategories, fetchProducts, fetchRules, fetchCategories, 
    reloadAllData, addProduct, updateProduct, deleteProduct, addRule, 
    updateRule, deleteRule, addCategory, updateCategory, deleteCategory, 
    handleFilterChange
  ]);
  
  // Provide all state and functions to components
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using AppContext
export const useAppContext = () => useContext(AppContext);

export default AppContext; 