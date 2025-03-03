import React, { useContext, useEffect } from "react";
import { ProductContext } from "../../context/ProductContext";
import useProductOperations from "../../hooks/useProductOperations"; // Ensure correct import
import styles from "./EditProductForm.module.css";

const EditProductForm = ({ product, onClose, onUpdateProduct }) => {
    const { setEditingProduct, setFilteredProducts, setCategories } = useContext(ProductContext);
    const { formData, handleChange, resetForm } = useProductOperations(
        product || {},
        setFilteredProducts,
        setCategories,
        setEditingProduct
    );

    useEffect(() => {
        resetForm(product || {});
    }, [product, resetForm]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdateProduct(formData);
    };

    if (!product) return null;

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <label>
                Product ID:
                <input type="text" name="product_id" value={formData.product_id} onChange={handleChange} readOnly />
            </label>
            <label>
                Name:
                <input type="text" name="product_name" value={formData.product_name} onChange={handleChange} />
            </label>
            <label>
                Amount:
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} />
            </label>
            <label>
                Unit:
                <input type="text" name="unit" value={formData.unit} onChange={handleChange} />
            </label>
            <label>
                Category:
                <input type="text" name="category" value={formData.category} onChange={handleChange} />
            </label>
            <div className={styles.buttonGroup}>
                <button type="submit">Save</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </div>
        </form>
    );
};

export default EditProductForm;
