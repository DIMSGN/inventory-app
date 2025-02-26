import React, { useState } from "react";
import productService from "../../services/productService";
import Button from "../common/Button/Button";
import styles from "./ProductManager.module.css";

/**
 * ProductManager Component
 * This component allows users to add new products.
 * 
 * Props:
 * - fetchProducts: Function to fetch the list of products.
 * - categories: Array of product categories.
 */
const ProductManager = ({ fetchProducts, categories }) => {
    const [formData, setFormData] = useState({
        product_id: "",
        product_name: "",
        unit: "",
        category: "",
        amount: ""
    });
    const [newCategory, setNewCategory] = useState("");
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await productService.addProduct(formData);
            fetchProducts();
            setFormData({ product_id: "", product_name: "", unit: "", category: "", amount: "" });
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
        <div className={styles.container}>
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
                            {categories.map((category) => (
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
                <Button type="submit">Add Product</Button>
            </form>
        </div>
    );
};

export default ProductManager;