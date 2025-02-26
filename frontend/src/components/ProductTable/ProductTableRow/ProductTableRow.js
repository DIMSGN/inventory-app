import React from "react";
import styles from "./ProductTableRow.module.css";
import { getRowColor } from "../../../utils/getRowColor";

const ProductTableRow = ({ product, rules, onEditProduct, onDeleteProduct, openRuleModal }) => {
    return (
        <tr key={product.product_id} style={{ backgroundColor: getRowColor(product, rules) }}>
            <td>{product.product_id}</td>
            <td>{product.product_name}</td>
            <td>{product.category}</td>
            <td>{product.amount}</td>
            <td>{product.unit}</td>
            <td className={styles.actionsCell}>
                <button className={styles.editButton} onClick={() => onEditProduct(product)}>Edit</button>
                <button className={styles.deleteButton} onClick={() => onDeleteProduct(product.product_id)}>Delete</button>
                <button className={styles.addRuleButton} onClick={() => openRuleModal(product)}>Add Rule</button>
            </td>
        </tr>
    );
};

export default ProductTableRow;