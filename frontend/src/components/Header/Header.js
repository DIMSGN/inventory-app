// Import necessary modules and components
import React from "react";
import { motion, useAnimation } from "framer-motion";
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

    // Handle change in selected categories
    const handleCategoryChange = (e) => {
        onFilterChange(e.target.value);
    };

    return (
        <header className={styles.header}>
            <motion.div
                className={styles.inventoryBox}
                initial={{ opacity: 0 }}
                animate={controls}
                transition={{ duration: 0.6 }}
            >
                Inventory Management System
            </motion.div>
            <div className={styles.filterContainer}>
                <label htmlFor="categoryFilter">Filter by Category:</label>
                <select
                    id="categoryFilter"
                    onChange={handleCategoryChange}
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>
        </header>
    );
};

export default Header;