import { categoryService } from '../../../common/services';
import { toast } from 'react-toastify';
import { standardToastConfig } from './toastConfig';

/**
 * Validates a category name
 * @param {string} categoryName - The name to validate
 * @param {Array} existingCategories - List of existing categories to check for duplicates
 * @returns {Object} Validation result with isValid and message
 */
export const validateCategoryName = (categoryName, existingCategories = []) => {
  if (!categoryName?.trim()) {
    return { isValid: false, message: "Category name cannot be empty" };
  }
  
  // Check if category is only numeric (not allowed by the backend)
  if (/^[0-9]+$/.test(categoryName.trim())) {
    return { isValid: false, message: "Category name cannot be only numbers" };
  }
  
  // Check if category already exists
  const categoryExists = existingCategories.some(
    (category) => {
      const catName = typeof category === 'string' ? category : (category.name || '');
      return catName.toLowerCase() === categoryName.toLowerCase();
    }
  );
  
  if (categoryExists) {
    return { isValid: false, message: "Category already exists" };
  }
  
  return { isValid: true };
};

/**
 * Add a new category
 * @param {string} categoryName - The name of the category to add
 * @param {Function} fetchCategories - Function to refresh categories after adding
 * @returns {Promise<Object>} The result of the operation
 */
export const addCategory = async (categoryName, fetchCategories) => {
  try {
    // Correctly format the category object according to API expectations
    await categoryService.addCategory(categoryName);
    toast.success("Category added successfully!", standardToastConfig);
    
    if (fetchCategories) {
      await fetchCategories();
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error adding category:", error);
    toast.error(error.response?.data?.error || "Failed to add category", standardToastConfig);
    return { success: false, error };
  }
};

/**
 * Delete a category
 * @param {string|Object} category - The category to delete (either string name or object with id/name)
 * @param {Array} categories - Current list of categories
 * @param {Function} setCategories - Function to update categories state
 * @param {Function} fetchCategories - Function to refresh categories after deleting
 * @param {Array} products - Current list of products
 * @returns {Promise<Object>} The result of the operation
 */
export const deleteCategory = async (category, categories, setCategories, fetchCategories, products = []) => {
  if (!category) {
    toast.error('No category provided for deletion', standardToastConfig);
    return { success: false };
  }

  // Extract category name and id based on whether it's a string or object
  const categoryName = typeof category === 'string' ? category : (category.name || '');
  const categoryId = typeof category === 'object' && category.id ? category.id : null;

  console.log(`Attempting to delete category: ${categoryName} (ID: ${categoryId})`);

  // We no longer need to check for associated products as the backend now automatically handles this

  try {
    // Log what we're trying to delete
    console.log(`Deleting category - ID: ${categoryId}, Name: ${categoryName}`);
    
    let response;
    if (categoryId) {
      // If we have an ID, delete by ID
      console.log(`Using ID endpoint for deletion: ${categoryId}`);
      response = await categoryService.deleteCategoryById(categoryId);
    } else if (categoryName) {
      // If we have a name but no ID, delete by name
      console.log(`Using Name endpoint for deletion: ${categoryName}`);
      response = await categoryService.deleteCategoryByName(categoryName);
    } else {
      throw new Error("No category ID or name provided");
    }

    console.log('Delete category response:', response);

    // Check if deletion was successful
    if (response && response.status === 200) {
      // Update local state
      if (setCategories) {
        const updatedCategories = categories.filter(cat => {
          if (typeof cat === 'string') return cat !== categoryName;
          return cat.id !== categoryId && cat.name !== categoryName;
        });
        setCategories(updatedCategories);
      }

      // Refresh from server
      if (fetchCategories) {
        await fetchCategories();
      }
      
      toast.success(`Category ${categoryName} deleted successfully`, standardToastConfig);
      return { success: true };
    } else {
      console.error('Unexpected response status:', response?.status, 'Data:', response?.data);
      throw new Error(`Unexpected response from server: ${response?.status} ${JSON.stringify(response?.data || {})}`);
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    toast.error(`Failed to delete category: ${error.message || "Unknown error"}`, standardToastConfig);
    return { success: false, error };
  }
};

// The forceDeleteCategory function is now deprecated as the backend automatically
// handles association removal. We're keeping this function with a warning for backward compatibility.
export const forceDeleteCategory = async (category, categories, setCategories, fetchCategories) => {
  console.warn('forceDeleteCategory is deprecated - regular deleteCategory now handles association removal');
  return deleteCategory(category, categories, setCategories, fetchCategories);
}; 