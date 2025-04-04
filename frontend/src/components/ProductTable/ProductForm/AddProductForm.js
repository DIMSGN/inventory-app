import React, { useState, useContext } from "react";
import { ProductContext } from "../../../context/Product/ProductContext";
import productService from "../../../services/productService";
import categoryService from "../../../services/categoryService"; // Import categoryService
import Button from "../../common/Button/Button";
import styles from "./ProductForm.module.css";
import { toast } from "react-toastify";

const AddProductForm = ({ onClose }) => {
    const { fetchProducts, categories, setCategories, products } = useContext(ProductContext); // Access products from context
    const [formData, setFormData] = useState({
        product_id: "",
        product_name: "",
        unit: "",
        category: "",
        amount: "",
    });
    const [newCategory, setNewCategory] = useState(""); // State for the new category name
    const [isAddingCategory, setIsAddingCategory] = useState(false); // State to toggle between dropdown and input

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validate product_id to only allow integers
        if (name === "product_id" && value !== "" && !/^\d*$/.test(value)) {
            return; // Prevent invalid input without showing an error immediately
        }

        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate product_id before submission
        if (formData.product_id === "" || !/^\d+$/.test(formData.product_id)) {
            toast.error("Product ID must be a valid integer.");
            return;
        }

        // Validate product ID
        const isDuplicateId = products.some(
            (product) => String(product.product_id) === String(formData.product_id)
        );

        if (isDuplicateId) {
            toast.error("Product ID already exists. Please use a unique ID."); // Notify the user
            return;
        }

        // Validate product name
        const isDuplicateName = products.some(
            (product) => product.product_name.toLowerCase() === formData.product_name.toLowerCase()
        );

        if (isDuplicateName) {
            toast.error("Product name already exists. Please use a unique name.");
            return;
        }

        try {
            await productService.addProduct(formData); // Add the product via API
            toast.success("Product added successfully!");
            await fetchProducts(); // Refresh the product list
            setFormData({
                product_id: "",
                product_name: "",
                unit: "",
                category: "",
                amount: "",
            });
            onClose();
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error("Failed to add product. Please try again.");
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) {
            toast.error("Category name cannot be empty.");
            return;
        }

        try {
            const response = await categoryService.addCategory(newCategory); // Add category via API
            setCategories((prev) => [...prev, { id: response.data.id, name: newCategory }]); // Update categories state
            setFormData((prevData) => ({ ...prevData, category: newCategory })); // Set the new category as selected
            setNewCategory(""); // Clear the input
            toast.success("Category added successfully!");
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.error); // Handle duplicate category error
            } else {
                console.error("Error adding category:", error);
                toast.error("Failed to add category. Please try again.");
            }
        }
    };

    const handleDeleteCategory = async (categoryName) => {
        if (!categoryName) {
            console.error("Category name is undefined"); // Debug log
            return;
        }

        try {
            await categoryService.deleteCategory(categoryName); // Call the API to delete the category
            setCategories((prev) => prev.filter((category) => category.name !== categoryName)); // Update the state
            toast.success("Category deleted successfully!");
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Failed to delete category. Please try again.");
        }
    };

    return (
        <div>
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
                    <div className={styles.customDropdown}>
                        {/* Selected Category */}
                        <div
                            className={styles.selectedCategory}
                            onClick={() => setIsAddingCategory((prev) => !prev)} // Toggle dropdown visibility
                        >
                            {formData.category || "Select a category"}
                        </div>

                        {/* Dropdown Menu */}
                        {isAddingCategory && (
                            <div className={styles.dropdownMenu}>
                                {categories.map((category, index) => (
                                    <div key={`${category.name}-${index}`} className={styles.dropdownItem}>
                                        <span
                                            onClick={() => {
                                                setFormData((prevData) => ({
                                                    ...prevData,
                                                    category: category.name,
                                                })); // Set selected category
                                                setIsAddingCategory(false); // Close dropdown
                                            }}
                                            className={styles.categoryName}
                                        >
                                            {category.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteCategory(category.name)} // Pass the name instead of the id
                                            className={styles.deleteButton}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Add New Category */}
                        <div className={styles.addNewCategory}>
                            <input
                                type="text"
                                placeholder="New category"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className={styles.newCategoryInput}
                            />
                            <button type="button" onClick={handleAddCategory} className={styles.addCategoryButton}>
                                Add
                            </button>
                        </div>
                    </div>
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
                    <Button type="submit" variant="primary">
                        Add Product
                    </Button>
                    <Button type="button" onClick={onClose} variant="primary">
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddProductForm;