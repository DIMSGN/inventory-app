import { useState, useCallback } from 'react';
import { useAppContext } from '../../../common/contexts/AppContext';

/**
 * Custom hook for managing inventory rules
 * 
 * This hook centralizes all rule-related operations including adding, editing, 
 * deleting, and retrieving rules for a specific product.
 * 
 * @example
 * const {
 *   isLoading,
 *   formData,
 *   isEditing,
 *   handleChange,
 *   handleColorChange,
 *   handleAddRule,
 *   handleEditRule,
 *   handleDeleteRule,
 *   resetForm
 * } = useRuleManagement();
 * 
 * @returns {Object} Rule management methods and state
 */
const useRuleManagement = () => {
  // Get global context values and methods
  const {
    addRule,
    updateRule,
    deleteRule,
    rules
  } = useAppContext();

  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    rules: '',
    comparison: '>',
    amount: 0,
    color: '#ff0000'
  });

  /**
   * Reset form to default values or set new values
   * @param {Object} initialValues - Optional initial values to set
   */
  const resetForm = useCallback((initialValues = null) => {
    if (initialValues) {
      setFormData({
        product_id: initialValues.product_id || '',
        rules: initialValues.rules || '',
        comparison: initialValues.comparison || '>',
        amount: initialValues.amount || 0,
        color: initialValues.color || '#ff0000'
      });
    } else {
      setFormData({
        product_id: '',
        rules: '',
        comparison: '>',
        amount: 0,
        color: '#ff0000'
      });
    }
    setError(null);
  }, []);

  /**
   * Initialize the form for adding a rule for a specific product
   * @param {Object} product - The product to add a rule for
   */
  const initializeAddRule = useCallback((product) => {
    if (!product) return;

    setIsEditing(false);
    setFormData({
      product_id: product.product_id,
      rules: product.product_name, // Default rule name to product name
      comparison: '>',
      amount: 0,
      color: '#ff0000'
    });
  }, []);

  /**
   * Initialize form for editing an existing rule
   * @param {Object} rule - Rule to edit
   */
  const initializeEditRule = useCallback((rule) => {
    if (!rule) return;

    setIsEditing(true);
    setFormData({
      id: rule.id,
      product_id: rule.product_id,
      rules: rule.rules,
      comparison: rule.comparison,
      amount: rule.amount,
      color: rule.color
    });
  }, []);

  /**
   * Handle form field changes
   * @param {Event} e - Input change event
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  /**
   * Handle color selection
   * @param {Object} colorOption - Selected color option
   */
  const handleColorChange = useCallback((colorOption) => {
    setFormData(prev => ({
      ...prev,
      color: colorOption.value
    }));
  }, []);

  /**
   * Add a new rule
   * @param {Object} closeModal - Optional function to close modal after adding
   * @returns {Promise<Object|null>} Added rule or null if error
   */
  const handleAddRule = useCallback(async (closeModal) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.rules || !formData.comparison || formData.amount === undefined || !formData.color) {
        throw new Error('All fields are required');
      }

      // Ensure product_id is included and is a string
      const ruleData = {
        ...formData,
        product_id: formData.product_id.toString(),
        amount: parseFloat(formData.amount)
      };

      console.log('Submitting rule:', ruleData);
      const result = await addRule(ruleData);
      
      if (result) {
        resetForm();
        if (closeModal) closeModal();
        return result;
      }
      
      return null;
    } catch (err) {
      console.error('Error adding rule:', err);
      setError(err.message || 'Failed to add rule');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [formData, addRule, resetForm]);

  /**
   * Update an existing rule
   * @param {Function} closeModal - Optional function to close modal after updating
   * @returns {Promise<Object|null>} Updated rule or null if error
   */
  const handleUpdateRule = useCallback(async (closeModal) => {
    if (!formData.id) {
      setError('Cannot update rule without ID');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Ensure product_id is included and is a string
      const ruleData = {
        ...formData,
        product_id: formData.product_id.toString(),
        amount: parseFloat(formData.amount)
      };

      const result = await updateRule(formData.id, ruleData);
      
      if (result) {
        resetForm();
        if (closeModal) closeModal();
        return result;
      }
      
      return null;
    } catch (err) {
      console.error('Error updating rule:', err);
      setError(err.message || 'Failed to update rule');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [formData, updateRule, resetForm]);

  /**
   * Delete a rule
   * @param {string|number} ruleId - ID of rule to delete
   * @returns {Promise<boolean>} Success status
   */
  const handleDeleteRule = useCallback(async (ruleId) => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await deleteRule(ruleId);
      if (success) {
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting rule:', err);
      setError(err.message || 'Failed to delete rule');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [deleteRule]);

  /**
   * Get rules for a specific product
   * @param {string|number} productId - Product ID to get rules for
   * @returns {Array} Rules for the product
   */
  const getProductRules = useCallback((productId) => {
    if (!productId || !rules) return [];
    return rules.filter(rule => rule.product_id.toString() === productId.toString());
  }, [rules]);

  return {
    // State
    isLoading,
    error,
    formData,
    isEditing,
    
    // Methods
    handleChange,
    handleColorChange,
    handleAddRule,
    handleUpdateRule,
    handleDeleteRule,
    getProductRules,
    resetForm,
    initializeAddRule,
    initializeEditRule
  };
};

export default useRuleManagement; 