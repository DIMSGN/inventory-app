import React, { useState, useCallback, useEffect, useRef } from "react";
import styles from "./ProductTableDropdown.module.css";

const ProductTableDropdown = ({ name, value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredOptions, setFilteredOptions] = useState(options);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setFilteredOptions(
            options.filter(option =>
                option.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, options]);

    const handleOptionClick = useCallback((optionValue) => {
        onChange({ target: { name, value: optionValue } });
        setIsOpen(false);
    }, [onChange, name]);

    const handleDropdownToggle = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    const activeOption = Array.isArray(options) ? options.find(option => option.id === value) || options[0] : null;

    useEffect(() => {
        if (isOpen) {
            dropdownRef.current.focus();
        }
    }, [isOpen]);

    if (!Array.isArray(options)) {
        console.error("options is not an array:", options);
        return <div>Error loading dropdown</div>;
    }

    return (
        <div className={styles.dropdownContainer}>
            <div
                className={styles.dropdownHeader}
                onClick={handleDropdownToggle}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                ref={dropdownRef}
            >
                <span className={styles.colorPreview} style={{ backgroundColor: activeOption?.value || 'transparent' }}></span>
                {activeOption ? `${activeOption.name} ${activeOption.comparison} ${activeOption.amount}` : "Select an option"}
            </div>
            {isOpen && (
                <div className={styles.dropdownList}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        autoFocus
                    />
                    {filteredOptions.map((option) => (
                        <div
                            key={option.id}
                            className={styles.dropdownOption}
                            onClick={() => handleOptionClick(option.id)}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleOptionClick(option.id);
                                }
                            }}
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