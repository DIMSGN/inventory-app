// Import necessary modules and components
import React from "react";
import { motion } from "framer-motion";
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

    return (
        <header className={styles.header}>
            <motion.div
                className={styles.inventoryBox}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
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
 * - motion: This module from framer-motion is used to add animations to the component.
 * - Select: This module from react-select is used to create a customizable multi-select dropdown.
 * - styles: This imports the CSS module for styling the component.
 * 
 * Why it’s implemented this way:
 * - The motion component is used to add animations to the header title and inventory box.
 * - The header element contains a title and a multi-select dropdown to filter products by category.
 * - The multi-select dropdown allows users to select multiple categories at once, improving the filtering experience.
 */