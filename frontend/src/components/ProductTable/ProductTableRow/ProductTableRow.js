import React from "react";
import styles from "./ProductTableRow.module.css";
import { getRowColor } from "../../../utils/getRowColor";
import ProductTableDropdown from "../ProductTableDropdown/ProductTableDropdown";

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
            <td>{product.product_id}</td>
            <td>{product.product_name}</td>
            <td>{product.category}</td>
            <td>{product.amount}</td>
            <td>{product.unit}</td>
            <td className={styles.rulesCell}>
                <ProductTableDropdown
                    name="rules"
                    value={rules.find(rule => rule.product_id === product.product_id && getRowColor(product, rules) === rule.color)?.id || ""}
                    onChange={() => {}}
                    options={dropdownOptions}
                />
            </td>
            <td className={styles.actionsCell}>
                <button className={styles.editButton} onClick={() => onEditProduct(product)}>Edit</button>
                <button className={styles.deleteButton} onClick={() => onDeleteProduct(product.product_id)}>Delete</button>
                <button className={styles.addRuleButton} onClick={openRuleModal}>Add Rule</button>
            </td>
        </tr>
    );
};

export default ProductTableRow;

/*this file filters the rules associated with the product,
 maps them to dropdown options, and provides buttons for editing, deleting, and adding rules.*/
