import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { API_URL, STORAGE_KEYS } from '../config';
import { productService, toastService } from "../services";

const { showSuccess, showError } = toastService;

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProducts();
      const data = response.data;
      setProducts(data);
      setFilteredProducts(data);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data));
      return data;
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
      showError(`Error loading products: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getProductById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProductById(id);
      return response.data;
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to fetch product');
      showError(`Error fetching product: ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = useCallback(async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.addProduct(productData);
      setProducts(prev => [...prev, response.data]);
      setFilteredProducts(prev => [...prev, response.data]);
      showSuccess('Product added successfully');
      return response.data;
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.message || 'Failed to add product');
      showError(`Error adding product: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await productService.updateProduct(id, productData);
      
      if (result && result.data) {
        // Get the updated product data from the response
        const updatedData = result.data.product || productData;
        
        // Update the local state immediately for better UI responsiveness
        setProducts(prevProducts => 
          prevProducts.map(p => p.product_id === id ? updatedData : p)
        );
        
        setFilteredProducts(prevFiltered => 
          prevFiltered.map(p => p.product_id === id ? updatedData : p)
        );
        
        // Clear editing product state
        setEditingProduct(null);
        
        showSuccess('Product updated successfully');
      }
      
      return result?.data;
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.message || 'Failed to update product');
      showError(`Error updating product: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await productService.deleteProduct(id);
      
      // Update local state after successful deletion
      setProducts(prev => prev.filter(product => product.product_id.toString() !== id.toString()));
      setFilteredProducts(prev => prev.filter(product => product.product_id.toString() !== id.toString()));
      
      showSuccess('Product deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.message || 'Failed to delete product');
      showError(`Error deleting product: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter products based on category and search term
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

  // Filter products whenever category or search term changes
  useEffect(() => {
    let result = [...products];
    
    if (selectedCategory) {
      result = result.filter(product => product.category_id === selectedCategory);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.description?.toLowerCase().includes(term)
      );
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, searchTerm]);

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Try to use cached data first for faster initial render
        const cachedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        if (cachedProducts) {
          const parsedProducts = JSON.parse(cachedProducts);
          setProducts(parsedProducts);
          setFilteredProducts(parsedProducts);
          console.log("Using cached products");
        }
      } catch (err) {
        console.error("Error loading cached products:", err);
      }
      
      // Then fetch fresh data
      await fetchProducts();
    };
    
    loadInitialData();
  }, [fetchProducts]);

  const value = {
    // State
    products,
    filteredProducts,
    selectedCategory,
    searchTerm,
    loading,
    error,
    editingProduct,
    
    // Setters
    setSelectedCategory,
    setSearchTerm,
    setEditingProduct,
    
    // Operations
    fetchProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    handleFilterChange
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsContext; 