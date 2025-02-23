import React from "react";
import Select from "react-select";
import styles from "./CategorySelect.module.css";

/**
 * CategorySelect Component
 * This component renders a multi-select dropdown to filter products by category.
 * 
 * Props:
 * - categoryOptions: An array of category options for the dropdown.
 * - handleCategoryChange: Function to call when the selected categories change.
 */
const CategorySelect = ({ categoryOptions, handleCategoryChange }) => {
    return (
        <div className={styles.headerDropdown}>
            <Select
                isMulti
                options={categoryOptions}
                onChange={handleCategoryChange}
                placeholder="Select categories"
                classNamePrefix="react-select"
            />
        </div>
    );
};

export default CategorySelect;