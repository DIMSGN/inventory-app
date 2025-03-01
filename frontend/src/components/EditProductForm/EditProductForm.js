import React, { useContext, useEffect } from "react";
import { ProductContext } from "../../context/ProductContext";
import useForm from "../../hooks/useForm"; // Import useForm
import styles from "./EditProductForm.module.css";

const EditProductForm = () => {
    const { editingProduct, handleUpdateProduct, setEditingProduct } = useContext(ProductContext);
    const { formData, handleChange, resetForm } = useForm(editingProduct || {});

    useEffect(() => {
        resetForm(editingProduct || {});
    }, [editingProduct, resetForm]);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateProduct(formData);
    };

    if (!editingProduct) return null;

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
                <button type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
            </div>
        </form>
    );
};

export default EditProductForm;
