import React, { useState, useCallback } from "react";
import styles from "./ProductTableDropdown.module.css";

const ProductTableDropdown = ({ name, value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionClick = useCallback((optionValue) => {
        onChange({ target: { name, value: optionValue } });
        setIsOpen(false);
    }, [onChange, name]);

    const handleDropdownToggle = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    const activeOption = Array.isArray(options) ? options.find(option => option.id === value) || options[0] : null;

    if (!Array.isArray(options)) {
        console.error("options is not an array:", options);
        return <div>Error loading dropdown</div>;
    }

    return (
        <div className={styles.dropdownContainer}>
            <div className={styles.dropdownHeader} onClick={handleDropdownToggle}>
                <span className={styles.colorPreview} style={{ backgroundColor: activeOption?.value || 'transparent' }}></span>
                {activeOption ? `${activeOption.name} ${activeOption.comparison} ${activeOption.amount}` : "Select an option"}
            </div>
            {isOpen && (
                <div className={styles.dropdownList}>
                    {options.map((option) => (
                        <div
                            key={option.id}
                            className={styles.dropdownOption}
                            onClick={() => handleOptionClick(option.id)}
                        >
                            <span className={styles.colorPreview} style={{ backgroundColor: option.value }}></span>
                            {`${option.name} ${option.comparison} ${option.amount}`}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default React.memo(ProductTableDropdown);