import { useState } from 'react';
import moment from 'moment';
import { salesService } from '../../../../../../common/services';

/**
 * Custom hook for managing sales form state and submission
 * @param {string} saleType - Type of sale ('food', 'coffee', 'cocktail', or 'drink')
 * @param {Object} initialState - Initial form state
 * @returns {Object} Form state and handlers
 */
const useSalesForm = (saleType, initialState) => {
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      ...initialState,
      sale_date: new Date().toISOString().split('T')[0]
    });
  };

  // Handle form field changes
  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle date change
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      sale_date: date ? moment(date).format('YYYY-MM-DD') : new Date().toISOString().split('T')[0]
    });
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Call the appropriate API endpoint based on sale type
      switch (saleType) {
        case 'food':
          await salesService.recordFoodSale(formData);
          break;
        case 'coffee':
          await salesService.recordCoffeeSale(formData);
          break;
        case 'cocktail':
          await salesService.recordCocktailSale(formData);
          break;
        case 'drink':
          await salesService.recordDrinkSale(formData);
          break;
        default:
          throw new Error("Invalid sale type");
      }
      
      // Success message
      setSuccess(`${saleType.charAt(0).toUpperCase() + saleType.slice(1)} sale recorded successfully.`);
      
      // Reset form
      resetForm();
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (err) {
      console.error(`Error recording ${saleType} sale:`, err);
      setError(`Failed to record ${saleType} sale. ${err.response?.data?.error || 'Please try again later.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    error,
    success,
    setError,
    setSuccess,
    handleChange,
    handleDateChange,
    handleSubmit,
    resetForm
  };
};

export default useSalesForm; 