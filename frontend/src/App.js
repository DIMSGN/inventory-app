import React, { useState, useContext, useEffect } from "react";
import { ProductContext } from "./context/Product/ProductContext";
import Header from "./components/Header/Header";
import ProductTable from "./components/ProductTable/ProductTable";
import RuleList from "./components/RuleList/RuleList";
import AddProductForm from "./components/ProductTable/ProductForm/AddProductForm";
import EditProductForm from "./components/ProductTable/ProductForm/EditProductForm";
import RuleModal from "./components/ProductTable/RuleModal/RuleModal";
import ProductTableRow from "./components/ProductTable/ProductTableRow/ProductTableRow"; // Import ProductTableRow
import ProductModal from "./components/ProductTable/ProductModal/ProductModal";
import useFetch from "./hooks/useFetch";
import {
    handleEditRule,
    handleUpdateRule,
    handleDeleteRule,
    handleColorChange
} from "./utils/ruleHandlers";
import { updateData } from "./utils/apiUtils";
import styles from "./App.css";

const App = () => {
    const [showProductManager, setShowProductManager] = useState(false);
    const [showRuleList, setShowRuleList] = useState(false);
    const [rules, setRules] = useState([]);
    const [currentRule, setCurrentRule] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { editingProduct, setEditingProduct, fetchProducts, products } = useContext(ProductContext);
    const [currentProduct, setCurrentProduct] = useState(null);

    const { data: fetchedRules, loading } = useFetch(`${process.env.REACT_APP_API_URL}/rules`);

    useEffect(() => {
        if (!loading && fetchedRules) {
            setRules(fetchedRules);
        }
    }, [fetchedRules, loading]);

    const handleToggleRuleList = () => {
        setShowRuleList(!showRuleList);
    };

    const handleAddFormClose = () => {
        setShowProductManager(false); // Close Add Product Modal
    };

    const handleEditFormClose = () => {
        setEditingProduct(null);
    };

    const handleUpdateProduct = async (updatedProduct) => {
        try {
            await updateData(`/products/${updatedProduct.product_id}`, updatedProduct);
            fetchProducts();
            setEditingProduct(null);
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await fetch(`/api/products/${productId}`, { method: "DELETE" });
            fetchProducts(); // Refresh the product list after deletion
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleAddRule = async (newRule, setRules, setCurrentRule, setShowForm) => {
        try {
            const response = await fetch("/api/rules", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newRule)
            });
            if (!response.ok) {
                throw new Error("Failed to add rule");
            }
            const addedRule = await response.json();
            setRules((prevRules) => [...prevRules, addedRule]);
            setCurrentRule(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error adding rule:", error);
        }
    };

    const openRuleModal = (rule = null, product = null) => {
        setCurrentRule(rule);
        setCurrentProduct(product);
        setIsEditing(!!rule);
        setIsRuleModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await handleUpdateRule(currentRule, setRules, setCurrentRule, setShowForm);
        } else {
            await handleAddRule(currentRule, setRules, setCurrentRule, setShowForm);
        }
        setIsRuleModalOpen(false);
    };

    return (
        <div className={styles.container}>
            <Header />
            <ProductTable
                onAddProductClick={() => setShowProductManager(true)}
                onToggleRuleList={handleToggleRuleList}
                showRuleList={showRuleList}
                setShowForm={setShowForm}
                setCurrentRule={setCurrentRule}
                setEditingProduct={setEditingProduct}
                setCurrentProduct={setCurrentProduct}
                openRuleModal={openRuleModal}
                handleDeleteProduct={handleDeleteProduct} // Pass handleDeleteProduct
            />
            {/* Add Product Modal */}
            {showProductManager && (
                <ProductModal title="Add New Product" onClose={handleAddFormClose}>
                    <AddProductForm onClose={handleAddFormClose} />
                </ProductModal>
            )}
            {/* Edit Product Modal */}
            {editingProduct && (
                <ProductModal title={`Edit Product: ${editingProduct.product_name}`} onClose={handleEditFormClose}>
                    <EditProductForm
                        product={editingProduct}
                        onClose={handleEditFormClose}
                        onUpdateProduct={handleUpdateProduct}
                    />
                </ProductModal>
            )}
            {showRuleList && (
                <div className={styles.ruleContainer}>
                    <RuleList
                        rules={rules}
                        openRuleModal={openRuleModal}
                        handleDelete={(id) => handleDeleteRule(id, setRules)}
                    />
                </div>
            )}
            {isRuleModalOpen && (
                <RuleModal
                    currentProduct={currentProduct}
                    formData={currentRule}
                    handleChange={(e) => setCurrentRule({ ...currentRule, [e.target.name]: e.target.value })}
                    handleSubmit={handleFormSubmit}
                    setIsRuleModalOpen={setIsRuleModalOpen}
                    products={products}
                    rules={rules}
                    setFormData={setCurrentRule}
                    isEditing={isEditing}
                />
            )}
        </div>
    );
};

export default App;
