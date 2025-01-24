import React, { useState } from "react";
import styles from "./CustomDropdown.module.css";

/**
 * CustomDropdown Component
 * This component renders a dropdown menu with the provided options.
 * 
 * Props:
 * - name: The name of the dropdown.
 * - value: The current value of the dropdown.
 * - onChange: Function to handle the change event.
 * - options: Array of options for the dropdown.
 */
const CustomDropdown = ({ name, value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionClick = (optionValue) => {
        onChange({ target: { name, value: optionValue } });
        setIsOpen(false);
    };

    const activeOption = options.find(option => option.value === value);

    return (
        <div className={styles.dropdownContainer}>
            <div className={styles.dropdownHeader} onClick={() => setIsOpen(!isOpen)}>
                <span className={styles.colorPreview} style={{ backgroundColor: activeOption?.value || 'transparent' }}></span>
                {activeOption ? activeOption.name : "Select a color"}
            </div>
            {isOpen && (
                <div className={styles.dropdownList}>
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={styles.dropdownOption}
                            onClick={() => handleOptionClick(option.value)}
                        >
                            <span className={styles.colorPreview} style={{ backgroundColor: option.value }}></span>
                            {option.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;