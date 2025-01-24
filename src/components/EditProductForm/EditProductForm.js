// Import necessary modules and components
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EditProductForm.module.css";

/**
 * EditProductForm Component
 * This component renders a form to edit an existing product.
 * It allows users to update the product details and save the changes.
 * 
 * Props:
 * - product: The product object to be edited.
 * - onUpdate: Function to call when the product is successfully updated.
 * - onCancel: Function to call when the edit is canceled.
 * - fetchProducts: Function to fetch the updated product list.
 */
const EditProductForm = ({ product, onUpdate, onCancel, fetchProducts }) => {
    // Initialize form data state with the product details
    const [formData, setFormData] = useState({ ...product });

    // Update form data state when the product prop changes
    useEffect(() => {
        setFormData({ ...product });
    }, [product]);

    /**
     * Handle input change event
     * This function updates the form data state when an input value changes.
     * @param {Object} e - The event object.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    /**
     * Handle form submit event
     * This function prevents the default form submission and calls the onSave function.
     * @param {Object} e - The event object.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSave();
    };

    /**
     * Save the updated product details
     * This function sends a PUT request to update the product details in the database.
     * If the update is successful, it calls the onUpdate function and fetches the updated product list.
     * If the update fails, it handles the error appropriately without displaying alerts.
     */
    const onSave = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/products/${product.product_id}`, formData);
            onUpdate(response.data);
            await fetchProducts(); // Fetch the updated product list
        } catch (error) {
            console.error("Error updating product:", error);
            // Handle the error silently without displaying alerts
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
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};

export default EditProductForm;

/**
 * Explanation of Imports:
 * - React: This module is used to create React components and manage component state and lifecycle.
 * - useState: A React hook that allows you to add state to functional components.
 * - useEffect: A React hook that allows you to perform side effects in functional components.
 * - axios: This module is used to make HTTP requests from the browser to the server.
 * - styles: This imports the CSS module for styling the component.
 * 
 * Why it’s implemented this way:
 * - The useState hook is used to manage the form data state, which holds the product details being edited.
 * - The useEffect hook is used to update the form data state whenever the product prop changes.
 * - The handleChange function updates the form data state when an input value changes.
 * - The handleSubmit function prevents the default form submission and calls the onSave function.
 * - The onSave function sends a PUT request to update the product details in the database and handles the response.
 * - The form element contains input fields for each product detail and buttons to save or cancel the edit.
 */
