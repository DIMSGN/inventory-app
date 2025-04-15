import React, { useState, useEffect } from "react";
import styles from "./ProductForm.module.css";
import Button from "../../common/Button/Button";
import { useAppContext } from "../../../context/AppContext";

/**
 * EditProductForm component for editing existing products
 * @param {Object} props - Component props
 * @param {Object} props.product - The product to edit
 * @param {Function} props.onClose - Function to close the form
 * @param {Function} props.onUpdateProduct - Function to handle product updates
 */
const EditProductForm = ({ product, onClose, onUpdateProduct }) => {
    const { categories, updateCategory } = useAppContext();
    const [formData, setFormData] = useState({
        product_id: product?.product_id || "",
        product_name: product?.product_name || "",
        unit: product?.unit || "",
        category: product?.category || "",
        amount: product?.amount || ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCategoryEdit, setShowCategoryEdit] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                product_id: product.product_id,
                product_name: product.product_name,
                unit: product.unit,
                category: product.category,
                amount: product.amount
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const success = await onUpdateProduct(formData);
            if (success) {
                onClose();
            }
        } catch (error) {
            console.error("Error updating product:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditCategory = (category) => {
        if (typeof category === 'object' && category !== null) {
            setCategoryToEdit(category);
            setNewCategoryName(category.name);
            setShowCategoryEdit(true);
        }
    };

    const handleCategoryUpdate = async () => {
        if (!categoryToEdit || !newCategoryName.trim()) return;
        
        setIsUpdatingCategory(true);
        try {
            await updateCategory(categoryToEdit.id, newCategoryName);
            setShowCategoryEdit(false);
            setCategoryToEdit(null);
            setNewCategoryName("");
        } catch (error) {
            console.error("Error updating category:", error);
        } finally {
            setIsUpdatingCategory(false);
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
                    value={formData.product_id}
                    readOnly
                    disabled
                />
            </label>
            <label>
                Product Name:
                <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
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
            <div className={styles.categoryContainer}>
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
                <Button
                    type="button"
                    variant="primary"
                    onClick={() => setShowCategoryEdit(!showCategoryEdit)}
                >
                    {showCategoryEdit ? "Hide Category Editor" : "Edit Categories"}
                </Button>
            </div>

            {showCategoryEdit && (
                <div className={styles.categoryEditSection}>
                    <h3>Edit Category Names</h3>
                    <p className={styles.helpText}>Select a category to rename it. This will update the category for all products.</p>
                    
                    <div className={styles.categoryList}>
                        {categories.map((category, index) => (
                            <div key={index} className={styles.categoryItem}>
                                <span className={styles.categoryName}>
                                    {typeof category === 'object' ? category.name : category}
                                </span>
                                <Button
                                    type="button"
                                    variant="edit"
                                    onClick={() => handleEditCategory(category)}
                                >
                                    Edit
                                </Button>
                            </div>
                        ))}
                    </div>

                    {categoryToEdit && (
                        <div className={styles.categoryEditForm}>
                            <h4>Rename "{categoryToEdit.name}"</h4>
                            <div className={styles.editCategoryInput}>
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="New category name"
                                    required
                                />
                                <div className={styles.categoryEditButtons}>
                                    <Button
                                        type="button"
                                        variant="success"
                                        onClick={handleCategoryUpdate}
                                        disabled={isUpdatingCategory}
                                        icon="fas fa-save"
                                    >
                                        {isUpdatingCategory ? "Updating..." : "Update"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => {
                                            setCategoryToEdit(null);
                                            setNewCategoryName("");
                                        }}
                                        disabled={isUpdatingCategory}
                                        icon="fas fa-times"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                            <p className={styles.warningText}>
                                Warning: This will update all products that use this category.
                            </p>
                        </div>
                    )}
                </div>
            )}

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
                <Button
                    type="submit"
                    variant="success"
                    disabled={isSubmitting}
                    icon="fas fa-save"
                >
                    {isSubmitting ? "Saving..." : "Save"}
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

export default EditProductForm;
