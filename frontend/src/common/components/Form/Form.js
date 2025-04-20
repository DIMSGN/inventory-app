import React from "react";
import PropTypes from "prop-types";
import Button from "../Button/Button";
import styles from "./Form.module.css";

/**
 * Generic form component that renders fields based on configuration
 * @param {Object} props - Component props
 * @param {Object} props.formData - Form data state
 * @param {Function} props.onChange - Change handler for form fields
 * @param {Function} props.onSubmit - Form submission handler
 * @param {Array} props.fields - Form field configurations
 * @param {Array} props.buttons - Button configurations
 * @returns {React.ReactElement} Form component
 */
const Form = ({ formData, onChange, onSubmit, fields, buttons }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {fields.map((field) => {
        const { type, name, label, required, options, ...rest } = field;
        const value = formData[name] !== undefined ? formData[name] : "";

        // Render different input types
        let input;
        switch (type) {
          case "select":
            input = (
              <select 
                name={name} 
                value={value} 
                onChange={onChange} 
                required={required}
                {...rest}
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            );
            break;
          
          case "textarea":
            input = (
              <textarea
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                {...rest}
              />
            );
            break;
          
          case "custom":
            // For custom components like ColorSelect
            input = field.component({
              name,
              value,
              onChange: field.customOnChange || onChange,
              ...rest
            });
            break;
          
          default: // text, number, etc.
            input = (
              <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                {...rest}
              />
            );
        }

        return (
          <label key={name} className={field.className}>
            {label}
            {input}
          </label>
        );
      })}

      <div className={styles.buttonGroup}>
        {buttons.map((button, index) => (
          <Button
            key={index}
            type={button.type || "button"}
            onClick={button.onClick}
            variant={button.variant || "primary"}
          >
            {button.label}
          </Button>
        ))}
      </div>
    </form>
  );
};

Form.propTypes = {
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      required: PropTypes.bool,
      options: PropTypes.array,
      component: PropTypes.func,
      customOnChange: PropTypes.func
    })
  ).isRequired,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      onClick: PropTypes.func,
      variant: PropTypes.string
    })
  ).isRequired
};

export default Form; 