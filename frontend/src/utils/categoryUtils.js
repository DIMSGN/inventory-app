import { categoryService } from '../services/apiServices';
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
 * @returns {Promise<Object>} The result of the operation
 */
export const deleteCategory = async (category, categories, setCategories, fetchCategories) => {
  if (!category) {
    toast.error('No category provided for deletion', standardToastConfig);
    return { success: false };
  }

  // Extract category name and id based on whether it's a string or object
  const categoryName = typeof category === 'string' ? category : (category.name || '');
  const categoryId = typeof category === 'object' && category.id ? category.id : null;

  console.log(`Attempting to delete category: ${categoryName} (ID: ${categoryId})`);

  try {
    if (categoryId !== null) {
      console.log(`Deleting category by ID: ${categoryId}`);
      await categoryService.deleteCategoryById(categoryId);
    } else {
      console.log(`Deleting category by name: ${categoryName}`);
      await categoryService.deleteCategoryByName(categoryName);
    }

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
  } catch (error) {
    console.error('Error deleting category:', error);
    
    if (error.response?.status === 404) {
      toast.error(`Category ${categoryName} not found. It may have been already deleted.`, standardToastConfig);
    } else {
      toast.error(`Failed to delete category: ${error.message}`, standardToastConfig);
    }
    
    return { success: false, error };
  }
}; 