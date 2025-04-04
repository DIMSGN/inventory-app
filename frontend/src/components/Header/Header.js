// Import necessary modules and components
import React, { useContext } from "react";
import { motion } from "framer-motion";
import { ProductContext } from "../../context/Product/ProductContext";
import CategorySelect from "./CategorySelect/CategorySelect"; // Import CategorySelect component
import styles from "./Header.module.css";

/**
 * Header Component
 * This component renders the header of the Inventory Management System.
 * It includes a title and a multi-select dropdown to filter products by category.
 */
const Header = () => {
    const { categories, handleFilterChange } = useContext(ProductContext);

    // Convert categories to options for react-select
    const categoryOptions = categories.map((category) => ({
        value: category,
        label: category,
    }));

    return (
        <header className={styles.header}>
            <motion.div
                className={styles.inventoryBox}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                Inventory Management System
            </motion.div>
            <div className={styles.controls}>
                <CategorySelect
                    categoryOptions={categoryOptions}
                    handleCategoryChange={handleFilterChange}
                />
            </div>
        </header>
    );
};

export default Header;