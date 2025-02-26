import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../common/Button/Button"; // Correct import path
import styles from "./EditProductForm.module.css";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const EditProductForm = ({ product, onUpdate, onCancel, fetchProducts }) => {
    const [formData, setFormData] = useState({ ...product });

    useEffect(() => {
        setFormData({ ...product });
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSave();
    };

    const onSave = async () => {
        try {
            const response = await axios.put(`${API_BASE_URL}/products/${product.product_id}`, formData);
            onUpdate(response.data);
            await fetchProducts();
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

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
                <Button type="submit">Save</Button>
                <Button type="button" onClick={onCancel}>Cancel</Button>
            </div>
        </form>
    );
};

export default EditProductForm;
