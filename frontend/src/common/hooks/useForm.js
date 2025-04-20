import { useState, useCallback } from 'react';

/**
 * Generic hook for handling form state and operations
 * 
 * @param {Object} options - Hook configuration options
 * @param {Object} options.initialValues - Initial form values
 * @param {Function} options.onSubmit - Submit handler function
 * @param {Function} options.validate - Optional validation function
 * @returns {Object} Form state and handler functions
 */
const useForm = ({ initialValues = {}, onSubmit, validate }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(true);

  /**
   * Handle change in form field values
   * @param {Event|string} event - DOM event or field name
   * @param {*} value - Field value (used when field name is passed directly)
   */
  const handleChange = useCallback((event, value) => {
    // Handle both event objects and direct field name/value pairs
    const fieldName = typeof event === 'string' 
      ? event 
      : event.target.name;
    
    const fieldValue = typeof event === 'string'
      ? value
      : event.target.value;
    
    setValues(prevValues => ({
      ...prevValues,
      [fieldName]: fieldValue
    }));

    // Clear error for this field if it exists
    if (errors[fieldName]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  }, [errors]);

  /**
   * Handle form submission
   * @param {Event} event - Form submission event
   */
  const handleSubmit = useCallback(async (event) => {
    if (event) {
      event.preventDefault();
    }

    setIsSubmitting(true);
    
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors || {});
      setIsValid(Object.keys(validationErrors || {}).length === 0);
      
      if (Object.keys(validationErrors || {}).length > 0) {
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit]);

  /**
   * Reset form to initial values or specified values
   * @param {Object} newValues - Optional new values to set
   */
  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setIsValid(true);
  }, [initialValues]);

  /**
   * Set multiple form values at once
   * @param {Object} newValues - Object containing field/value pairs
   */
  const setMultipleValues = useCallback((newValues) => {
    setValues(prevValues => ({
      ...prevValues,
      ...newValues
    }));
  }, []);

  return {
    values,
    errors,
    isSubmitting,
    isValid,
    handleChange,
    handleSubmit,
    resetForm,
    setValues: setMultipleValues
  };
};

export default useForm; 