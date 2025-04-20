import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toastService, productService } from "../services";

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
  
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      toast.error(`Error loading products: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getProductById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/products/${id}`);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch product');
      toast.error(`Error fetching product: ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = useCallback(async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/products', productData);
      setProducts(prev => [...prev, response.data]);
      setFilteredProducts(prev => [...prev, response.data]);
      toast.success('Product added successfully');
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to add product');
      toast.error(`Error adding product: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/products/${id}`, productData);
      const updatedProduct = response.data;
      
      setProducts(prev => 
        prev.map(product => product.id === id ? updatedProduct : product)
      );
      
      setFilteredProducts(prev => 
        prev.map(product => product.id === id ? updatedProduct : product)
      );
      
      toast.success('Product updated successfully');
      return updatedProduct;
    } catch (err) {
      setError(err.message || 'Failed to update product');
      toast.error(`Error updating product: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(prev => prev.filter(product => product.id !== id));
      setFilteredProducts(prev => prev.filter(product => product.id !== id));
      toast.success('Product deleted successfully');
    } catch (err) {
      setError(err.message || 'Failed to delete product');
      toast.error(`Error deleting product: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter products based on category and search term
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

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const value = {
    products,
    filteredProducts,
    loading,
    error,
    selectedCategory,
    searchTerm,
    setSelectedCategory,
    setSearchTerm,
    fetchProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsContext; 