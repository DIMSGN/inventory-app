import React, { useState } from "react";
import axios from "axios";
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
        name: "",
        category: "",
        price: "",
        quantity: ""
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
            await axios.post("http://localhost:5000/api/products", formData);
            fetchProducts();
            setFormData({ name: "", category: "", price: "", quantity: "" });
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
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
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
                            <button type="button" onClick={handleAddCategory}>Add</button>
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
                    Price:
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Quantity:
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default ProductManager;