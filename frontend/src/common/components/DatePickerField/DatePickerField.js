import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import styles from './DatePickerField.module.css';

/**
 * Reusable DatePickerField component
 * @param {Object} props - Component props
 * @param {string} props.label - Label text for the date picker
 * @param {Date|string|moment} props.selected - Selected date value
 * @param {Function} props.onChange - Function called when date changes
 * @param {string} props.name - Field name for form handling
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.dateFormat - Format string for date display (default: 'yyyy-MM-dd')
 * @param {boolean} props.isClearable - Whether the field can be cleared
 * @param {boolean} props.required - Whether the field is required
 * @param {string} props.className - Additional class name for styling
 * @param {Object} props.labelProps - Props for the label element
 * @param {string} props.width - Width of the field ('full', 'half', or custom value)
 * @param {string} props.helpText - Optional help text to display below the field
 */
const DatePickerField = ({
  label,
  selected,
  onChange,
  name,
  placeholder = 'Select date',
  dateFormat = 'yyyy-MM-dd',
  isClearable = true,
  required = false,
  className = '',
  labelProps = {},
  width = 'full',
  helpText,
  ...rest
}) => {
  // Handle different date formats (Date object, string, moment)
  const getDateValue = () => {
    if (!selected) return null;
    
    // If it's a moment object
    if (selected && typeof selected === 'object' && selected._isAMomentObject) {
      return selected.toDate();
    }
    
    // If it's a string, convert to Date
    if (typeof selected === 'string') {
      return new Date(selected);
    }
    
    // If it's already a Date object
    return selected;
  };

  // Handle date change
  const handleChange = (date) => {
    if (onChange) {
      if (name) {
        // For forms that expect name, value format
        onChange(name, date ? moment(date).format('YYYY-MM-DD') : null);
      } else {
        // For direct onChange handlers
        onChange(date);
      }
    }
  };

  // Determine width class
  const widthClass = width === 'full' ? styles.fullWidth : 
                     width === 'half' ? styles.halfWidth : '';

  return (
    <div className={`${styles.datePickerField} ${widthClass} ${className}`}>
      {label && (
        <label htmlFor={name} {...labelProps}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <DatePicker
        id={name}
        name={name}
        selected={getDateValue()}
        onChange={handleChange}
        dateFormat={dateFormat}
        placeholderText={placeholder}
        isClearable={isClearable}
        className={styles.datePicker}
        required={required}
        {...rest}
      />
      
      {helpText && <small className={styles.helpText}>{helpText}</small>}
    </div>
  );
};

export default DatePickerField; 