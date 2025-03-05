import React from "react";
import styles from "./ProductTableRow.module.css";
import { getRowColor } from "../../../utils/getRowColor";
import ProductTableDropdown from "../ProductTableDropdown/ProductTableDropdown";
import Button from "../../common/Button/Button"; // Updated import

const ProductTableRow = ({ product, rules, onEditProduct, onDeleteProduct, openRuleModal }) => {
    const dropdownOptions = rules.filter(rule => rule.product_id === product.product_id).map(rule => ({
        id: rule.id,
        name: rule.rules,
        comparison: rule.comparison,
        amount: rule.amount,
        value: rule.color
    }));

    return (
        <tr key={product.product_id} style={{ backgroundColor: getRowColor(product, rules) }}>
            <td data-label="Product ID">{product.product_id}</td>
            <td data-label="Name">{product.product_name}</td>
            <td data-label="Category">{product.category}</td>
            <td data-label="Amount">{product.amount}</td>
            <td data-label="Unit">{product.unit}</td>
            <td data-label="Rules" className={styles.rulesCell}>
                <ProductTableDropdown
                    name="rules"
                    value={rules.find(rule => rule.product_id === product.product_id && getRowColor(product, rules) === rule.color)?.id || ""}
                    onChange={() => {}}
                    options={dropdownOptions}
                />
            </td>
            <td data-label="Actions" className={styles.actionsCell}>
                <Button variant="edit" onClick={() => onEditProduct(product)}>Edit</Button>
                <Button variant="delete" onClick={() => onDeleteProduct(product.product_id)}>Delete</Button>
                <Button variant="primary" onClick={() => openRuleModal(product)}>Add Rule</Button>
            </td>
        </tr>
    );
};

export default ProductTableRow;
