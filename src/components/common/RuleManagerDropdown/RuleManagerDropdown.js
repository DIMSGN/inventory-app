import React, { useState } from "react";
import styles from "./CustomDropdown.module.css";

const RuleManagerDropdown = ({ name, value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionClick = (optionValue) => {
        onChange({ target: { name, value: optionValue } });
        setIsOpen(false);
    };

    const handleDropdownToggle = () => {
        setIsOpen(!isOpen);
    };

    const activeOption = options.find(option => option.value === value) || options[0]; // Default to first rule

    return (
        <div className={styles.dropdownContainer}>
            <div className={styles.dropdownHeader} onClick={handleDropdownToggle}>
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

export default RuleManagerDropdown;