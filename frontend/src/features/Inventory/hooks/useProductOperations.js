import { useState } from 'react';
import { toastService, productService } from '../../../common/services';
import { useAppContext } from '../../../common/contexts/AppContext';
import { toast } from 'react-toastify';
import { errorHandler } from '../utils/errorHandler';

const { showSuccess, showError } = toastService;

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
  const { fetchProducts } = useAppContext();

  /**
   * Handle edit product operation
   * @param {Object} product - Product to edit
   */
  const handleEditProduct = async (productId, productData) => {
    try {
      setIsLoading(true);
      console.log(`Updating product ID: ${productId}`, productData);
      
      // Call the API directly to update the product
      const response = await productService.updateProduct(productId, productData);
      console.log('Product update API response:', response);
      
      if (response && response.status === 200) {
        // Get the updated product from the response
        const updatedProduct = response.data.product || productData;
        
        // Refresh products data to ensure UI is updated correctly
        await fetchProducts();
        
        // Close the edit form
        setEditingProduct(null);
        
        showSuccess('Product updated successfully');
        return updatedProduct;
      } else {
        throw new Error("Failed to update product: Unexpected response");
      }
    } catch (error) {
      console.error('Error updating product:', error);
      showError(error.response?.data?.error || error.message || 'Failed to update product');
      return null;
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