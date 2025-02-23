import React, { useState } from "react";
import styles from "./CustomDropdown.module.css";

const ProductTableDropdown = ({ name, value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionClick = (optionValue) => {
        onChange({ target: { name, value: optionValue } });
        setIsOpen(false);
    };

    const handleDropdownToggle = () => {
        setIsOpen(!isOpen);
    };

    const activeOption = options.find(option => option.id === value) || options[0]; // Default to first rule

    return (
        <div className={styles.dropdownContainer}>
            <div className={styles.dropdownHeader} onClick={handleDropdownToggle}>
                <span className={styles.colorPreview} style={{ backgroundColor: activeOption?.value || 'transparent' }}></span>
                {activeOption ? `${activeOption.name} (${activeOption.comparison} ${activeOption.amount})` : "   No rules set"}
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
                            {`${option.name} (${option.comparison} ${option.amount})`}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductTableDropdown;