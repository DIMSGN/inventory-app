import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styles from "./ColorSelect.module.css";
import { colors } from "../../../utils/colors";

const ColorSelect = ({ name, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const triggerRef = useRef(null);
    const dropdownRef = useRef(null);
    
    // Find the selected color object
    const selectedColor = colors.find(color => color.value === value) || colors[0];
    
    // Toggle dropdown
    const toggleDropdown = () => {
        if (!isOpen) {
            updateDropdownPosition();
        }
        setIsOpen(!isOpen);
    };
    
    // Update dropdown position based on trigger element
    const updateDropdownPosition = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    };
    
    // Handle selection
    const handleColorSelect = (color) => {
        if (onChange) {
            onChange({
                value: color.value,
                label: color.name
            });
        }
        setIsOpen(false);
    };
    
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && 
                triggerRef.current && 
                !triggerRef.current.contains(event.target) && 
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);
    
    // Update position if window is resized
    useEffect(() => {
        window.addEventListener("resize", updateDropdownPosition);
        return () => {
            window.removeEventListener("resize", updateDropdownPosition);
        };
    }, []);

    // Render dropdown outside the modal using portal
    const renderDropdown = () => {
        if (!isOpen) return null;
        
        return ReactDOM.createPortal(
            <div 
                className={styles.colorDropdown}
                ref={dropdownRef}
                style={{
                    top: `${dropdownPosition.top}px`,
                    left: `${dropdownPosition.left}px`,
                    width: `${dropdownPosition.width}px`
                }}
            >
                {colors.map(color => (
                    <div 
                        key={color.value} 
                        className={`${styles.colorOption} ${color.value === value ? styles.colorOptionSelected : ''}`}
                        onClick={() => handleColorSelect(color)}
                    >
                        <div 
                            className={styles.colorOptionPreview} 
                            style={{ backgroundColor: color.value }}
                        ></div>
                        <span>{color.name}</span>
                    </div>
                ))}
            </div>,
            document.body
        );
    };

    return (
        <>
            <div className={styles.colorSelectContainer}>
                {/* Selected color display */}
                <div 
                    className={styles.colorSelectHeader} 
                    onClick={toggleDropdown}
                    ref={triggerRef}
                >
                    <div 
                        className={styles.colorPreview} 
                        style={{ backgroundColor: selectedColor.value }}
                    ></div>
                    <span className={styles.colorName}>{selectedColor.name}</span>
                    <span className={styles.dropdownArrow}></span>
                </div>
                
                {/* Hidden input for form submission */}
                <input 
                    type="hidden"
                    name={name}
                    value={value}
                />
            </div>
            
            {/* Render dropdown outside of modal */}
            {renderDropdown()}
        </>
    );
};

ColorSelect.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

export default ColorSelect;