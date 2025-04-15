import { useState } from 'react';
import { showSuccess, showError } from '../services/toastService';
import { productService } from '../services/apiServices';

/**
 * Custom hook for product operations
 * 
 * @param {Object|null} initialValues - Initial values for the product
 * @param {Function} setFilteredProducts - Function to update filtered products
 * @param {Function} setCategories - Function to update categories
 * @param {Function} setEditingProduct - Function to set the product being edited
 * @returns {Object} Object containing handler functions
 */
const useProductOperations = (
  initialValues = null,
  setFilteredProducts,
  setCategories,
  setEditingProduct
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  /**
   * Handle edit product operation
   * @param {Object} product - Product to edit
   */
  const handleEditProduct = async (product) => {
    try {
      setIsLoading(true);
      
      // Get existing products from localStorage
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      
      // Update the product
      const updatedProducts = products.map(p => 
        p.product_id === product.product_id ? product : p
      );
      
      // Save to localStorage
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      
      // Update state
      setFilteredProducts(updatedProducts);
      setEditingProduct(null);
      
      showSuccess('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      showError('Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Show delete confirmation modal for a product
   * @param {string|number} productId - ID of the product to delete
   */
  const confirmDeleteProduct = (productId) => {
    setProductToDelete(productId);
    setShowDeleteConfirmation(true);
  };

  /**
   * Cancel delete operation
   */
  const cancelDeleteProduct = () => {
    setProductToDelete(null);
    setShowDeleteConfirmation(false);
  };

  /**
   * Handle delete product operation after confirmation
   */
  const handleDeleteProductConfirmed = async () => {
    if (!productToDelete) return;
    
    try {
      setIsLoading(true);
      console.log(`Confirming deletion of product: ${productToDelete}`);
      
      // Call the API to delete the product from the database
      const response = await productService.deleteProduct(productToDelete);
      console.log('Delete API response:', response);
      
      if (response.status === 200) {
        console.log(`Product ${productToDelete} deleted from database successfully`);
        
        // After successful API deletion, update the local state
        // Get existing products from localStorage
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        
        // Filter out the deleted product
        const updatedProducts = products.filter(p => p.product_id !== productToDelete);
        
        // Save to localStorage
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        
        // Update state
        setFilteredProducts(updatedProducts);
        
        showSuccess('Product deleted successfully');
      } else {
        console.error('Unexpected response status:', response.status);
        showError('Failed to delete product: Unexpected response');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showError(error.response?.data?.error || error.message || 'Failed to delete product');
    } finally {
      setIsLoading(false);
      setProductToDelete(null);
      setShowDeleteConfirmation(false);
    }
  };

  return {
    handleEditProduct,
    handleDeleteProduct: confirmDeleteProduct,
    handleDeleteProductConfirmed,
    cancelDeleteProduct,
    showDeleteConfirmation,
    productToDelete,
    isLoading
  };
};

export default useProductOperations; 