import React, { useState, useEffect, useRef } from "react";
import styles from "./ProductForm.module.css";
import Button from "../../common/Button/Button";
import { useAppContext } from "../../../context/AppContext";
import { showError } from "../../../utils/utils";

/**
 * Generates the next sequential product ID
 * @param {Array} products - Array of existing products
 * @returns {number} Next available product ID
 */
const getNextProductId = (products) => {
    if (!products || products.length === 0) {
        return 1; // Start with 1 if no products exist
    }
    
    // Find the current highest product_id
    const highestId = Math.max(...products.map(product => 
        // Ensure we're comparing numbers
        typeof product.product_id === 'string' 
            ? parseInt(product.product_id, 10) 
            : product.product_id
    ));
    
    return highestId + 1;
};

/**
 * Formats product ID with leading zeros for display
 * @param {number} id - Product ID number
 * @returns {string} Formatted product ID with leading zeros (e.g., 0001)
 */
const formatProductId = (id) => {
    return id.toString().padStart(4, '0');
};

/**
 * AddProductForm component for adding new products
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Function to close the form
 */
const AddProductForm = ({ onClose }) => {
    const { addProduct, addCategory, deleteCategory, categories, products } = useAppContext();
    const [newCategory, setNewCategory] = useState("");
    const [formData, setFormData] = useState({
        product_id: null, // Will be set in useEffect after products are available
        product_name: "",
        unit: "",
        category: "",
        amount: ""
    });
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const productNameRef = useRef(null);

    // Set initial product ID when products load
    useEffect(() => {
        if (products && products.length >= 0) {
            const nextId = getNextProductId(products);
            setFormData(prevState => ({
                ...prevState,
                product_id: nextId
            }));
        }
    }, [products]);

    useEffect(() => {
        // Focus on product_name field since product_id is auto-generated
        if (productNameRef.current) {
            productNameRef.current.focus();
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Form field ${name} changed to: ${value} (type: ${typeof value})`);
        
        // Add special handling for category to ensure consistency
        if (name === 'category') {
            console.log('Category selected:', value);
            
            // If value is numeric string, convert to number to be consistent with database
            const newValue = !isNaN(value) ? parseInt(value, 10) : value;
            console.log('Normalized category value:', newValue, '(type:', typeof newValue, ')');
            
            setFormData({
                ...formData,
                [name]: newValue
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validate form data
            if (!formData.product_id || !formData.product_name || !formData.unit || !formData.category || formData.amount === "") {
                showError("All fields are required");
                setIsSubmitting(false);
                return;
            }

            // Ensure product_id is numeric
            const submitData = {
                ...formData,
                product_id: parseInt(formData.product_id, 10)
            };

            const success = await addProduct(submitData);
            if (success) {
                onClose();
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            showError(error.message || "Failed to add product");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) {
            showError("Category name cannot be empty");
            return;
        }

        if (categories.includes(newCategory.trim())) {
            showError("Category already exists");
            return;
        }

        try {
            await addCategory(newCategory);
            setNewCategory("");
        } catch (error) {
            console.error("Error adding category:", error);
            showError(error.message || "Failed to add category");
        }
    };

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) {
            showError("Please select a category to delete");
            return;
        }

        try {
            await deleteCategory(categoryToDelete);
            setCategoryToDelete(null);
            
            // If deleted category was selected in the form, reset it
            if (formData.category === categoryToDelete) {
                setFormData({
                    ...formData,
                    category: ""
                });
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            showError(error.message || "Failed to delete category");
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.heading}>Product Manager</h2>
            <label>
                Product ID:
                <input
                    type="text"
                    name="product_id"
                    value={formData.product_id ? `#${formatProductId(formData.product_id)}` : ''}
                    readOnly
                    className={styles.generatedField}
                />
                <small className={styles.fieldNote}>Auto-generated sequential ID</small>
            </label>
            <label>
                Product Name:
                <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    ref={productNameRef}
                    required
                />
            </label>
            <label>
                Unit:
                <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Category:
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a category</option>
                    {categories.map((category, index) => (
                        <option key={index} value={typeof category === 'object' ? category.id : category}>
                            {typeof category === 'object' ? category.name : category}
                        </option>
                    ))}
                </select>
            </label>
            <div className={styles.categorySection}>
                <div className={styles.newCategoryInput}>
                    <input
                        type="text"
                        placeholder="New category name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <Button
                        type="button"
                        onClick={handleAddCategory}
                        variant="success"
                        icon="fas fa-plus"
                    >
                        Add Category
                    </Button>
                </div>
                <div className={styles.deleteCategoryInput}>
                    <select
                        value={categoryToDelete || ""}
                        onChange={(e) => setCategoryToDelete(e.target.value)}
                    >
                        <option value="">Select a category to delete</option>
                        {categories.map((category, index) => (
                            <option key={index} value={typeof category === 'object' ? category.id : category}>
                                {typeof category === 'object' ? category.name : category}
                            </option>
                        ))}
                    </select>
                    <Button
                        type="button"
                        onClick={handleDeleteCategory}
                        variant="delete"
                        icon="fas fa-trash-alt"
                    >
                        Delete Category
                    </Button>
                </div>
            </div>
            <label>
                Amount:
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                />
            </label>
            <div className={styles.buttonGroup}>
                <Button type="submit" variant="success" icon="fas fa-save" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Product"}
                </Button>
                <Button
                    type="button"
                    onClick={onClose}
                    variant="secondary"
                    disabled={isSubmitting}
                    icon="fas fa-times"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
};

export default AddProductForm;