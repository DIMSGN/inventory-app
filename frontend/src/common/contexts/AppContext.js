import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";

// Import services from common/services
import { 
  toastService, 
  apiServices, 
  recipeService,
  productService,
  ruleService,
  categoryService
} from "../services";

const { supplierService } = apiServices;
const { showSuccess, showError } = toastService;

// Base API URL from environment
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

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

  // State for units
  const [units, setUnits] = useState([]);

  // State for recipes
  const [recipes, setRecipes] = useState([]);
  
  // State for suppliers
  const [suppliers, setSuppliers] = useState([]);
  
  // State for UI
  const [isLoading, setIsLoading] = useState({
    products: false,
    rules: false,
    categories: false,
    units: false,
    recipes: false,
    suppliers: false
  });
  const [selectedFilterOptions, setSelectedFilterOptions] = useState([]);
  
  // Data fetching functions
  const fetchProducts = useCallback(async (forceClearCache = false) => {
    setIsLoading(prev => ({ ...prev, products: true }));
    try {
      const response = await productService.getProducts();
      const data = response.data;
      setProducts(data);
      setFilteredProducts(data);
      localStorage.setItem('cachedProducts', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, products: false }));
    }
  }, []);

  // Fetch recipes
  const fetchRecipes = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, recipes: true }));
    try {
      const data = await recipeService.getAllRecipes();
      setRecipes(data);
      return data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      showError("Failed to load recipes");
      return [];
    } finally {
      setIsLoading(prev => ({ ...prev, recipes: false }));
    }
  }, []);

  // Get a single recipe
  const getRecipe = useCallback(async (recipeId) => {
    setIsLoading(prev => ({ ...prev, recipes: true }));
    try {
      const data = await recipeService.getRecipeById(recipeId);
      return data;
    } catch (error) {
      console.error(`Error fetching recipe ${recipeId}:`, error);
      showError("Failed to load recipe");
      return null;
    } finally {
      setIsLoading(prev => ({ ...prev, recipes: false }));
    }
  }, []);

  // Create recipe
  const createRecipe = useCallback(async (recipe) => {
    setIsLoading(prev => ({ ...prev, recipes: true }));
    try {
      const result = await recipeService.createRecipe(recipe);
      await fetchRecipes(); // Refresh recipes list
      showSuccess("Recipe created successfully");
      return result;
    } catch (error) {
      console.error('Error creating recipe:', error);
      showError(error.message || "Failed to create recipe");
      throw error;
    } finally {
      setIsLoading(prev => ({ ...prev, recipes: false }));
    }
  }, [fetchRecipes]);

  // Update recipe
  const updateRecipe = useCallback(async (recipeId, recipeData) => {
    setIsLoading(prev => ({ ...prev, recipes: true }));
    try {
      const result = await recipeService.updateRecipe(recipeId, recipeData);
      await fetchRecipes(); // Refresh recipes list
      showSuccess("Recipe updated successfully");
      return result;
    } catch (error) {
      console.error(`Error updating recipe ${recipeId}:`, error);
      showError(error.message || "Failed to update recipe");
      throw error;
    } finally {
      setIsLoading(prev => ({ ...prev, recipes: false }));
    }
  }, [fetchRecipes]);

  // Delete recipe
  const deleteRecipe = useCallback(async (recipeId) => {
    setIsLoading(prev => ({ ...prev, recipes: true }));
    try {
      await recipeService.deleteRecipe(recipeId);
      // Update state directly for immediate UI update
      setRecipes(prevRecipes => prevRecipes.filter(r => r.recipe_id !== recipeId));
      showSuccess("Recipe deleted successfully");
      return true;
    } catch (error) {
      console.error(`Error deleting recipe ${recipeId}:`, error);
      showError(error.message || "Failed to delete recipe");
      return false;
    } finally {
      setIsLoading(prev => ({ ...prev, recipes: false }));
    }
  }, []);

  const fetchRules = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, rules: true }));
    try {
      const fetchedRules = await ruleService.getRules();
      setRules(fetchedRules.data);
      localStorage.setItem('cachedRules', JSON.stringify(fetchedRules.data));
      return fetchedRules.data;
    } catch (error) {
      console.error("Error fetching rules:", error);
      showError("Failed to load rules");
      return [];
    } finally {
      setIsLoading(prev => ({ ...prev, rules: false }));
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, categories: true }));
    try {
      const fetchedCategories = await categoryService.getCategories();
      setCategories(fetchedCategories.data);
      localStorage.setItem('cachedCategories', JSON.stringify(fetchedCategories.data));
      return fetchedCategories.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      showError("Failed to load categories");
      return [];
    } finally {
      setIsLoading(prev => ({ ...prev, categories: false }));
    }
  }, []);

  const fetchUnits = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, units: true }));
    try {
      const response = await axios.get(`${apiUrl}/units`);
      setUnits(response.data);
      localStorage.setItem('cachedUnits', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Error fetching units:", error);
      showError("Failed to load units");
      return [];
    } finally {
      setIsLoading(prev => ({ ...prev, units: false }));
    }
  }, []);
  
  // Fetch suppliers
  const fetchSuppliers = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, suppliers: true }));
    try {
      const response = await supplierService.getSuppliers();
      setSuppliers(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      showError("Failed to load suppliers");
      return [];
    } finally {
      setIsLoading(prev => ({ ...prev, suppliers: false }));
    }
  }, []);
  
  // New function to reload all data
  const reloadAllData = useCallback(async (forceClearCache = false) => {
    setIsLoading({
      products: true,
      rules: true, 
      categories: true,
      units: true,
      recipes: true,
      suppliers: true
    });
    
    try {
      console.log("Reloading all application data, force clear cache:", forceClearCache);
      
      // Fetch data sequentially to reduce network load and improve initial render
      // First fetch products as they're most important for UI
      await fetchProducts(forceClearCache);
      
      // Then fetch rules, categories, units, and recipes in parallel as they're less critical
      await Promise.all([
        fetchRules(),
        fetchCategories(),
        fetchUnits(),
        fetchRecipes(),
        fetchSuppliers()
      ]);
      
      showSuccess("Data refreshed successfully");
    } catch (error) {
      console.error("Error reloading data:", error);
      showError("Failed to refresh data");
    } finally {
      setIsLoading({
        products: false,
        rules: false,
        categories: false,
        units: false,
        recipes: false,
        suppliers: false
      });
    }
  }, [fetchProducts, fetchRules, fetchCategories, fetchUnits, fetchRecipes, fetchSuppliers]);

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
      // In the updated schema, we use category_id and we also receive category_name
      const categoryId = product.category_id || product.category;
      const categoryName = product.category_name || product.category;
      
      // Check if either the category ID or name matches selected options
      return selectedCategories.includes(String(categoryId)) || 
             selectedCategories.includes(categoryName);
    });
    
    setFilteredProducts(filtered);
  }, [products]);
  
  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      console.log("Loading initial application data...");
      
      // Try to use cached data first for a faster initial render
      try {
        const cachedProducts = localStorage.getItem('cachedProducts');
        const cachedRules = localStorage.getItem('cachedRules');
        const cachedCategories = localStorage.getItem('cachedCategories');
        const cachedUnits = localStorage.getItem('cachedUnits');
        
        if (cachedProducts) {
          const parsedProducts = JSON.parse(cachedProducts);
          setProducts(parsedProducts);
          setFilteredProducts(parsedProducts);
          console.log("Using cached products");
        }
        
        if (cachedRules) {
          setRules(JSON.parse(cachedRules));
          console.log("Using cached rules");
        }
        
        if (cachedCategories) {
          setCategories(JSON.parse(cachedCategories));
          console.log("Using cached categories");
        }
        
        if (cachedUnits) {
          setUnits(JSON.parse(cachedUnits));
          console.log("Using cached units");
        }
      } catch (error) {
        console.error("Error loading cached data:", error);
      }
      
      // Then load fresh data from the API
      await Promise.all([
        fetchProducts(),
        fetchRules(),
        fetchCategories(),
        fetchUnits(),
        fetchRecipes(),
        fetchSuppliers()
      ]);
    };
    
    loadInitialData();
  }, [fetchProducts, fetchRules, fetchCategories, fetchUnits, fetchRecipes, fetchSuppliers]);
  
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
      setIsLoading(prev => ({ ...prev, products: true }));
      console.log(`Updating product ID: ${id}`, updatedProduct);
      
      // Call the API to update the product
      const result = await productService.updateProduct(id, updatedProduct);
      console.log("API response for product update:", result);
      
      if (result && result.data) {
        // Get the updated product data from the response
        const updatedData = result.data.product || updatedProduct;
        console.log("Updated product data:", updatedData);
        
        // Update the local state immediately for better UI responsiveness
        setProducts(prevProducts => 
          prevProducts.map(p => p.product_id.toString() === id.toString() ? updatedData : p)
        );
        
        setFilteredProducts(prevFiltered => 
          prevFiltered.map(p => p.product_id.toString() === id.toString() ? updatedData : p)
        );
        
        // Clear editing product state
        setEditingProduct(null);
        
        showSuccess("Product updated successfully");
      }
      
      return result?.data;
    } catch (error) {
      console.error("Error updating product:", error);
      showError(error.message || "Failed to update product");
      return null;
    } finally {
      setIsLoading(prev => ({ ...prev, products: false }));
    }
  }, []);

  // Get rule color for a product based on amount
  const getRuleColor = useCallback((product) => {
    if (!product || !rules || rules.length === 0) return "";
    
    // Filter rules that apply to this specific product
    const productRules = rules.filter(rule => 
      rule.product_id === product.product_id
    );
    
    // If no specific rules for this product, return empty string
    if (productRules.length === 0) return "";

    const amount = parseFloat(product.amount);
    
    for (const rule of productRules) {
      const ruleAmount = parseFloat(rule.amount);
      const comparison = rule.comparison;
      
      if (comparison === "<" && amount < ruleAmount) {
        return rule.color;
      } else if (comparison === "<=" && amount <= ruleAmount) {
        return rule.color;
      } else if (comparison === ">" && amount > ruleAmount) {
        return rule.color;
      } else if (comparison === ">=" && amount >= ruleAmount) {
        return rule.color;
      } else if (comparison === "=" && amount === ruleAmount) {
        return rule.color;
      }
    }
    
    return "";
  }, [rules]);

  // Delete a product
  const deleteProduct = useCallback(async (productId) => {
    try {
      await productService.deleteProduct(productId);
      
      // Update local state after successful deletion
      setProducts(prevProducts => prevProducts.filter(p => p.product_id.toString() !== productId.toString()));
      setFilteredProducts(prevFiltered => prevFiltered.filter(p => p.product_id.toString() !== productId.toString()));
      
      showSuccess("Product deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      showError(error.message || "Failed to delete product");
      return false;
    }
  }, []);

  // Add a rule
  const addRule = useCallback(async (rule) => {
    try {
      const response = await ruleService.addRule(rule);
      await fetchRules(); // Refresh rules after adding
      showSuccess("Rule added successfully");
      return response.data;
    } catch (error) {
      console.error("Error adding rule:", error);
      showError(error.message || "Failed to add rule");
      return null;
    }
  }, [fetchRules]);

  // Update a rule
  const updateRule = useCallback(async (ruleId, updatedRule) => {
    try {
      const response = await ruleService.updateRule(ruleId, updatedRule);
      await fetchRules(); // Refresh rules after updating
      showSuccess("Rule updated successfully");
      return response.data;
    } catch (error) {
      console.error("Error updating rule:", error);
      showError(error.message || "Failed to update rule");
      return null;
    }
  }, [fetchRules]);

  // Delete a rule
  const deleteRule = useCallback(async (ruleId) => {
    try {
      await ruleService.deleteRule(ruleId);
      setRules(prevRules => prevRules.filter(r => r.id.toString() !== ruleId.toString()));
      showSuccess("Rule deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting rule:", error);
      showError(error.message || "Failed to delete rule");
      return false;
    }
  }, []);

  // Add a category
  const addCategory = useCallback(async (category) => {
    try {
      const response = await categoryService.addCategory(category);
      await fetchCategories(); // Refresh categories after adding
      showSuccess("Category added successfully");
      return response.data;
    } catch (error) {
      console.error("Error adding category:", error);
      showError(error.message || "Failed to add category");
      return null;
    }
  }, [fetchCategories]);

  // Delete a category
  const deleteCategory = useCallback(async (categoryId) => {
    try {
      await categoryService.deleteCategory(categoryId);
      await fetchCategories(); // Refresh categories after deleting
      showSuccess("Category deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      showError(error.message || "Failed to delete category");
      return false;
    }
  }, [fetchCategories]);

  // Add a unit
  const addUnit = useCallback(async (unit) => {
    try {
      const response = await axios.post(`${apiUrl}/units`, unit);
      await fetchUnits(); // Refresh units after adding
      showSuccess("Unit added successfully");
      return response.data;
    } catch (error) {
      console.error("Error adding unit:", error);
      showError(error.response?.data?.error || "Failed to add unit");
      return null;
    }
  }, [fetchUnits]);

  // Update a unit
  const updateUnit = useCallback(async (unitId, updatedUnit) => {
    try {
      const response = await axios.put(`${apiUrl}/units/${unitId}`, updatedUnit);
      await fetchUnits(); // Refresh units after updating
      showSuccess("Unit updated successfully");
      return response.data;
    } catch (error) {
      console.error("Error updating unit:", error);
      showError(error.response?.data?.error || "Failed to update unit");
      return null;
    }
  }, [fetchUnits]);

  // Delete a unit
  const deleteUnit = useCallback(async (unitId) => {
    try {
      await axios.delete(`${apiUrl}/units/${unitId}`);
      await fetchUnits(); // Refresh units after deleting
      showSuccess("Unit deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting unit:", error);
      showError(error.response?.data?.error || "Failed to delete unit");
      return false;
    }
  }, [fetchUnits]);

  // Get product rules
  const getProductRules = useCallback(async (productId) => {
    try {
      const response = await axios.get(`${apiUrl}/rules/product/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rules for product ${productId}:`, error);
      return [];
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        // States
        products,
        filteredProducts,
        rules,
        categories,
        units,
        recipes,
        suppliers,
        isLoading,
        editingProduct,
        currentRule,
        selectedFilterOptions,
        apiUrl,
        
        // Setters
        setProducts,
        setFilteredProducts,
        setRules,
        setCategories,
        setUnits,
        setRecipes,
        setSuppliers,
        setEditingProduct,
        setCurrentRule,
        setSelectedFilterOptions,
        
        // Operations
        fetchProducts,
        fetchRules,
        fetchCategories,
        fetchUnits,
        fetchRecipes,
        fetchSuppliers,
        reloadAllData,
        handleFilterChange,
        addProduct,
        updateProduct,
        deleteProduct,
        addRule,
        updateRule,
        deleteRule,
        addCategory,
        deleteCategory,
        addUnit,
        updateUnit,
        deleteUnit,
        getRuleColor,
        getProductRules,
        
        // Recipe operations
        getRecipe,
        createRecipe, 
        updateRecipe,
        deleteRecipe
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => useContext(AppContext); 