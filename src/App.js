// Import necessary modules and components
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductManager from "./components/ProductManager/ProductManager";
import RuleManager from "./components/RuleManager/RuleManager";
import ProductTable from "./components/ProductTable/ProductTable";
import Header from "./components/Header/Header";
import ProductOperations from "./components/ProductOperations/ProductOperations";
import EditProductForm from "./components/EditProductForm/EditProductForm"; // Import EditProductForm component
import styles from "./App.css";

/**
 * App Component
 * This is the main component of the Inventory Management System application.
 * It manages the state of products, categories, rules, and the currently editing product.
 * It also handles fetching data from the server and passing it to child components.
 */
const App = () => {
    // State to store the list of products
    const [products, setProducts] = useState([]);
    // State to store the list of filtered products
    const [filteredProducts, setFilteredProducts] = useState([]);
    // State to store the list of categories
    const [categories, setCategories] = useState([]);
    // State to store the currently editing product
    const [editingProduct, setEditingProduct] = useState(null);
    // State to store the list of rules
    const [rules, setRules] = useState([]); // Initialize rules
    // State to manage the visibility of the Add Product form
    const [showAddProductForm, setShowAddProductForm] = useState(false);
    // State to store the selected categories
    const [selectedCategories, setSelectedCategories] = useState([]);

    // Destructure functions from ProductOperations
    const {
        productTableRef,
        handleEditProduct,
        handleUpdateProduct,
        handleDeleteProduct,
        handleCancelEdit,
        fetchProducts, // Ensure fetchProducts is destructured
    } = ProductOperations({
        setProducts,
        setFilteredProducts,
        setCategories,
        setEditingProduct,
    });

    /**
     * Fetch rules from the server
     * This function sends a GET request to fetch all rules and updates the state of the rule list.
     */
    const fetchRules = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/rules");
            setRules(response.data); // Update the state of the rule list
        } catch (error) {
            console.error("Error fetching rules:", error);
            alert(`Failed to fetch rules: ${error.response?.data?.error || error.message}`);
        }
    };

    // Fetch rules when the component mounts
    useEffect(() => {
        fetchRules();
    }, []);

    // Toggle the visibility of the Add Product form
    const handleAddProductClick = () => {
        setShowAddProductForm(!showAddProductForm);
    };

    // Handle filter change
    const handleFilterChange = (categories) => {
        setSelectedCategories(categories);
    };

    return (
        <>
            <div className={styles.container}>
                {/* Header component to filter products by category */}
                <Header 
                    categories={categories} 
                    onFilterChange={handleFilterChange} 
                />
                <div className={styles.productTable}>
                    {/* ProductTable component to display the list of products */}
                    <ProductTable
                        ref={productTableRef}
                        products={products}
                        onEditProduct={handleEditProduct}
                        onDeleteProduct={handleDeleteProduct}
                        rules={rules} // Pass rules to ProductTable
                        onAddProductClick={handleAddProductClick} // Pass the add product click handler
                        selectedCategories={selectedCategories} // Pass selected categories to ProductTable
                    />
                </div>
                {editingProduct && (
                    <div className={styles.editProductForm}>
                        {/* EditProductForm component to edit the selected product */}
                        <EditProductForm 
                            product={editingProduct} 
                            onUpdate={handleUpdateProduct} 
                            onCancel={handleCancelEdit} 
                            fetchProducts={fetchProducts} 
                        />
                    </div>
                )}
            </div>
            {showAddProductForm && (
                <div className={styles.productManager}>
                    {/* ProductManager component to add new products */}
                    <ProductManager fetchProducts={fetchProducts} categories={categories} />
                </div>
            )}
            <div className={styles.ruleManager}>
                {/* RuleManager component to manage rules */}
                <RuleManager />
            </div>
        </>
    );
};

export default App;
