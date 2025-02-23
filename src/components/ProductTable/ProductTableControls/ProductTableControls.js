import React from "react";
import styles from "./ProductTableControls.module.css";

/**
 * ProductTableControls Component
 * This component renders the controls for the ProductTable, including buttons for exporting to PDF, adding a product, and exporting orders.
 * 
 * Props:
 * - exportToPDF: Function to call when the Export to PDF button is clicked.
 * - onAddProductClick: Function to call when the Add Product button is clicked.
 * - exportOrderRequirements: Function to call when the Export Orders button is clicked.
 */
const ProductTableControls = ({ exportToPDF, onAddProductClick, exportOrderRequirements }) => {
    return (
        <div className={styles.controls}>
            <button className={styles.exportButton} onClick={exportToPDF}>
                Export to PDF
            </button>
            <div className={styles.buttonGroup}>
                <button className={styles.addButton} onClick={onAddProductClick}>
                    Add Product
                </button>
            </div>
            <button className={styles.exportOrdersButton} onClick={exportOrderRequirements}>
                Export Orders
            </button>
        </div>
    );
};

export default ProductTableControls;