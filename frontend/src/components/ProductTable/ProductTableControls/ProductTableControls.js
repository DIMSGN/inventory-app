import React from "react";
import Button from "../../common/Button/Button"; // Updated import
import styles from "./ProductTableControls.module.css";

/**
 * ProductTableControls Component
 * This component renders the controls for the ProductTable, including buttons for exporting to PDF, adding a product, and exporting orders.
 * 
 * Props:
 * - exportToPDF: Function to call when the Export to PDF button is clicked.
 * - onAddProductClick: Function to call when the Add Product button is clicked.
 * - exportOrderRequirements: Function to call when the Export Orders button is clicked.
 * - onToggleRuleList: Function to call when the Show/Hide Rule List button is clicked.
 * - showRuleList: Boolean indicating whether the rule list is currently shown.
 */
const ProductTableControls = ({ exportToPDF, onAddProductClick, exportOrderRequirements, onToggleRuleList, showRuleList }) => {
    return (
        <div className={styles.controls}>
            <Button onClick={onAddProductClick} variant="primary">Add Product</Button>
            <Button onClick={exportToPDF} variant="primary">Export to PDF</Button>
            <Button onClick={exportOrderRequirements} variant="primary">Export Order Requirements</Button>
            <Button onClick={onToggleRuleList} variant="primary">{showRuleList ? "Hide Rule List" : "Show Rule List"}</Button>
        </div>
    );
};

export default ProductTableControls;