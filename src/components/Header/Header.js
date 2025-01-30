// Import necessary modules and components
import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Select from "react-select";
import styles from "./Header.module.css";

/**
 * Header Component
 * This component renders the header of the Inventory Management System.
 * It includes a title and a multi-select dropdown to filter products by category.
 * 
 * Props:
 * - categories: An array of category names to populate the dropdown.
 * - onFilterChange: Function to call when the selected categories change.
 */
const Header = ({ categories, onFilterChange }) => {
    const controls = useAnimation();
    const [isBroken, setIsBroken] = useState(false);

    // Convert categories to options for react-select
    const categoryOptions = categories.map((category) => ({
        value: category,
        label: category,
    }));

    // Handle change in selected categories
    const handleCategoryChange = (selectedOptions) => {
        const selectedCategories = selectedOptions ? selectedOptions.map(option => option.value) : [];
        onFilterChange(selectedCategories);
    };

    // Punch effect function
    const punchEffect = async () => {
        await controls.start({ scale: 1.02, rotate: 2, transition: { duration: 0.1 } });
        await controls.start({ scale: 1, rotate: 0, transition: { duration: 0.1 } });
        setIsBroken(true);
    };

    return (
        <header className={styles.header}>
            <motion.div
                className={styles.inventoryBox}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                onClick={punchEffect}
                animate={controls}
            >
                Inventory Management System
            </motion.div>
            <div className={styles.controls}>
                <Select
                    isMulti
                    options={categoryOptions}
                    onChange={handleCategoryChange}
                    placeholder="Select categories"
                    className={styles.multiSelect}
                />
            </div>
        </header>
    );
};

export default Header;

/**
 * Explanation of Imports:
 * - React: This module is used to create React components and manage component state.
 * - motion, useAnimation: These modules from framer-motion are used to add animations to the component.
 * - Select: This module from react-select is used to create a customizable multi-select dropdown.
 * - styles: This imports the CSS module for styling the component.
 * 
 * Why it’s implemented this way:
 * - The motion component is used to add animations to the header title and inventory box.
 * - The header element contains a title and a multi-select dropdown to filter products by category.
 * - The multi-select dropdown allows users to select multiple categories at once, improving the filtering experience.
 */