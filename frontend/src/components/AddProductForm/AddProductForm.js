import React, { useState, useContext } from "react";
import { ProductContext } from "../../context/ProductContext";
import productService from "../../services/productService";
import Button from "../common/Button/Button";
import styles from "./AddProductForm.module.css";
import useProductOperations from "../../hooks/useProductOperations"; // Import useProductOperations

const AddProductForm = ({ onClose }) => {
    const { fetchProducts, categories, setFilteredProducts, setCategories, setEditingProduct } = useContext(ProductContext);
    const { formData, handleChange, resetForm, setFormData } = useProductOperations(
        {
            product_id: "",
            product_name: "",
            unit: "",
            category: "",
            amount: ""
        },
        setFilteredProducts,
        setCategories,
        setEditingProduct
    );
    const [newCategory, setNewCategory] = useState("");
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await productService.addProduct(formData);
            fetchProducts();
            resetForm();
            onClose();
        } catch (error) {
            console.error("Error adding product:", error);
            alert(`Failed to add product: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleAddCategory = () => {
        if (newCategory.trim() !== "") {
            setFormData((prevData) => ({ ...prevData, category: newCategory.trim() }));
            setNewCategory("");
            setIsAddingCategory(false);
        }
    };

    return (
        <div>
            <h2 className={styles.heading}>Add New Product</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label>
                    Product ID:
                    <input
                        type="text"
                        name="product_id"
                        value={formData.product_id}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Name:
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
                <label>
                    Category:
                    {isAddingCategory ? (
                        <div className={styles.newCategoryInput}>
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Enter new category"
                                required
                            />
                            <Button type="button" onClick={handleAddCategory}>Add</Button>
                        </div>
                    ) : (
                        <select
                            name="category"
                            value={formData.category}
                            onChange={(e) => {
                                if (e.target.value === "add-new-category") {
                                    setIsAddingCategory(true);
                                } else {
                                    handleChange(e);
                                }
                            }}
                            required
                        >
                            <option value="">Select a category</option>
                            {Array.isArray(categories) && categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                            <option value="add-new-category">Add New Category</option>
                        </select>
                    )}
                </label>
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
                    <Button type="submit">Add Product</Button>
                    <Button type="button" onClick={onClose}>Cancel</Button>
                </div>
            </form>
        </div>
    );
};

export default AddProductForm;