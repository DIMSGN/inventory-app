import React from "react";
import styles from "./ProductTableRow.module.css";
import { useAppContext } from "../../../context/AppContext";
import { getRowColor } from "../../../utils/getRowColor";
import Icon from "../../common/Icon";

const ProductTableRow = ({ product, onEditProduct, onDeleteProduct, openRuleModal, rules }) => {
    // Get categories from context to look up category names
    const { categories } = useAppContext();
    
    // Check if amount is 0 or very low to apply warning class
    const isLowStock = product.amount <= 0;
    
    // Get category name if product.category is a number
    const getCategoryDisplay = (categoryValue) => {
        if (categoryValue === null || categoryValue === undefined) return "";
        
        console.log("Looking up category display for:", categoryValue, "type:", typeof categoryValue);
        console.log("Available categories:", categories);
        
        // If it's not a number, display as is
        if (isNaN(categoryValue)) return categoryValue;
        
        // Convert categoryValue to a number to ensure consistent comparison
        const categoryId = parseInt(categoryValue, 10);
        console.log("Converted category ID:", categoryId);
        
        // If it's a number, try to find the category name
        const categoryObj = categories.find(cat => {
            // Handle both string and number cases for IDs
            const catId = typeof cat.id === 'string' ? parseInt(cat.id, 10) : cat.id;
            console.log("Comparing category:", cat, "with ID:", catId, "against:", categoryId);
            return catId === categoryId;
        });
        
        if (categoryObj) {
            console.log("Found category:", categoryObj.name);
            return categoryObj.name;
        } else {
            console.log("Category not found, returning original value:", categoryValue);
            return categoryValue;
        }
    };
    
    // Get row background color based on rules
    const backgroundColor = getRowColor(product, rules);
    
    // Common cell styling based on rule highlighting
    const cellStyle = { backgroundColor };
    
    return (
        <tr className={isLowStock ? styles.lowStockRow : ''}>
            <td className={styles.centeredCell} style={cellStyle}>{product.product_id}</td>
            <td style={cellStyle}>{product.product_name}</td>
            <td style={cellStyle}>{getCategoryDisplay(product.category)}</td>
            <td className={`${styles.amountCell} ${isLowStock ? styles.lowStock : ''}`} style={cellStyle}>
                {product.amount}
            </td>
            <td style={cellStyle}>{product.unit}</td>
            <td className={styles.actionsCell}>
                <div className={styles.buttonContainer}>
                    {/* All actions as direct buttons */}
                    <button 
                        onClick={() => onEditProduct(product)} 
                        className={`${styles.iconButton} ${styles.editButton}`}
                        title="Edit Product"
                    >
                        <Icon className="fas fa-edit" />
                        <span>Edit</span>
                    </button>
                    
                    <button 
                        onClick={() => openRuleModal(null, product)} 
                        className={`${styles.iconButton} ${styles.ruleButton}`}
                        title="Add Rule"
                    >
                        <Icon className="fas fa-plus-circle" />
                        <span>Add Rule</span>
                    </button>
                    
                    <button 
                        onClick={() => onDeleteProduct(product.product_id)} 
                        className={`${styles.iconButton} ${styles.deleteButton}`}
                        title="Delete Product"
                    >
                        <Icon className="fas fa-trash-alt" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default ProductTableRow;
