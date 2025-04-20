/**
 * Validates financial data
 * @param {Object} data - The financial data to validate
 * @returns {Object} Validation result with valid flag and errors
 */
exports.validateFinancialData = (data) => {
  const errors = [];
  
  // Check if data has the required structures
  if (!data) {
    errors.push('Financial data is required');
    return { valid: false, errors };
  }
  
  // Check sales data
  if (!data.sales || !Array.isArray(data.sales)) {
    errors.push('Sales data must be an array');
  } else {
    // Validate each sales item
    data.sales.forEach((item, index) => {
      if (!item.id) {
        errors.push(`Sales item at index ${index} missing id`);
      }
      if (!item.name) {
        errors.push(`Sales item at index ${index} missing name`);
      }
      if (!item.months || !Array.isArray(item.months) || item.months.length !== 12) {
        errors.push(`Sales item "${item.name || index}" must have exactly 12 months of data`);
      } else {
        // Ensure all month values are numbers
        item.months.forEach((value, monthIndex) => {
          if (typeof value !== 'number') {
            errors.push(`Sales item "${item.name || index}" month ${monthIndex + 1} must be a number`);
          }
        });
      }
    });
  }
  
  // Check expenses structure
  if (!data.expenses) {
    errors.push('Expenses data is required');
  } else {
    // Check cost of goods data
    if (!data.expenses.costOfGoods || !Array.isArray(data.expenses.costOfGoods)) {
      errors.push('Cost of goods data must be an array');
    } else {
      // Validate each cost of goods item
      data.expenses.costOfGoods.forEach((item, index) => {
        if (!item.id) {
          errors.push(`Cost of goods item at index ${index} missing id`);
        }
        if (!item.name) {
          errors.push(`Cost of goods item at index ${index} missing name`);
        }
        if (!item.months || !Array.isArray(item.months) || item.months.length !== 12) {
          errors.push(`Cost of goods item "${item.name || index}" must have exactly 12 months of data`);
        } else {
          // Ensure all month values are numbers
          item.months.forEach((value, monthIndex) => {
            if (typeof value !== 'number') {
              errors.push(`Cost of goods item "${item.name || index}" month ${monthIndex + 1} must be a number`);
            }
          });
        }
      });
    }
    
    // Check operational expenses data
    if (!data.expenses.operational || !Array.isArray(data.expenses.operational)) {
      errors.push('Operational expenses data must be an array');
    } else {
      // Validate each operational expense item
      data.expenses.operational.forEach((item, index) => {
        if (!item.id) {
          errors.push(`Operational expense item at index ${index} missing id`);
        }
        if (!item.name) {
          errors.push(`Operational expense item at index ${index} missing name`);
        }
        if (!item.months || !Array.isArray(item.months) || item.months.length !== 12) {
          errors.push(`Operational expense item "${item.name || index}" must have exactly 12 months of data`);
        } else {
          // Ensure all month values are numbers
          item.months.forEach((value, monthIndex) => {
            if (typeof value !== 'number') {
              errors.push(`Operational expense item "${item.name || index}" month ${monthIndex + 1} must be a number`);
            }
          });
        }
      });
    }
    
    // Check utilities expenses data
    if (!data.expenses.utilities || !Array.isArray(data.expenses.utilities)) {
      errors.push('Utilities expenses data must be an array');
    } else {
      // Validate each utilities expense item
      data.expenses.utilities.forEach((item, index) => {
        if (!item.id) {
          errors.push(`Utilities expense item at index ${index} missing id`);
        }
        if (!item.name) {
          errors.push(`Utilities expense item at index ${index} missing name`);
        }
        if (!item.months || !Array.isArray(item.months) || item.months.length !== 12) {
          errors.push(`Utilities expense item "${item.name || index}" must have exactly 12 months of data`);
        } else {
          // Ensure all month values are numbers
          item.months.forEach((value, monthIndex) => {
            if (typeof value !== 'number') {
              errors.push(`Utilities expense item "${item.name || index}" month ${monthIndex + 1} must be a number`);
            }
          });
        }
      });
    }
  }
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : null
  };
}; 