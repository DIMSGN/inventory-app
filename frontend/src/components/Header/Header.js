// Import necessary modules and components
import React from "react";
import { motion, useAnimation } from "framer-motion";
import CategorySelect from "./CategorySelect/CategorySelect"; // Update import path
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
    };

    return (
        <header className={styles.header}>
            <motion.div
                className={styles.inventoryBox}
                initial={{ opacity: 0 }}
                animate={controls}
                transition={{ duration: 0.6 }}
                onClick={punchEffect}
            >
                Inventory Management System
            </motion.div>
            <CategorySelect
                categoryOptions={categoryOptions}
                handleCategoryChange={handleCategoryChange}
            />
        </header>
    );
};

export default Header;