import React, { useContext, useEffect, useRef } from "react";
import { ProductContext } from "../../../context/Product/ProductContext";
import useProductOperations from "../../../hooks/useProductOperations";
import Button from "../../common/Button/Button";
import styles from "./ProductForm.module.css";

const EditProductForm = ({ product, onClose, onUpdateProduct }) => {
    const { setEditingProduct, setFilteredProducts, setCategories } = useContext(ProductContext);
    const { formData, handleChange, resetForm } = useProductOperations(
        product || {}, // Ensure product is not null
        setFilteredProducts,
        setCategories,
        setEditingProduct
    );

    const prevProductRef = useRef(null); // Track the previous product

    useEffect(() => {
        // Only reset the form if the product prop changes
        if (product && product !== prevProductRef.current) {
            resetForm(product); // Reset form with the new product data
            prevProductRef.current = product; // Update the previous product reference
        }
    }, [product, resetForm]);

    if (!product) {
        console.warn("EditProductForm: No product selected for editing.");
        return <div>No product selected for editing.</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting form with data:", formData); // Debugging log
        if (typeof onUpdateProduct !== "function") {
            console.error("EditProductForm: onUpdateProduct is not a function.");
            return;
        }
        await onUpdateProduct(formData); // Call the parent function to update the product
        onClose(); // Close the form after submission
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <label>
                Product ID:
                <input type="text" name="product_id" value={formData.product_id || ""} onChange={handleChange} readOnly />
            </label>
            <label>
                Name:
                <input type="text" name="product_name" value={formData.product_name || ""} onChange={handleChange} />
            </label>
            <label>
                Amount:
                <input type="number" name="amount" value={formData.amount || ""} onChange={handleChange} />
            </label>
            <label>
                Unit:
                <input type="text" name="unit" value={formData.unit || ""} onChange={handleChange} />
            </label>
            <label>
                Category:
                <input type="text" name="category" value={formData.category || ""} onChange={handleChange} />
            </label>
            <div className={styles.buttonGroup}>
                <Button type="submit" variant="edit">Save</Button>
                <Button type="button" onClick={onClose} variant="primary">Cancel</Button>
            </div>
        </form>
    );
};

export default EditProductForm;
