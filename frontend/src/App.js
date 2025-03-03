import React, { useState, useContext, useEffect } from "react";
import { ProductContext } from "./context/ProductContext";
import Header from "./components/Header/Header";
import ProductTable from "./components/ProductTable/ProductTable";
import RuleList from "./components/RuleList/RuleList";
import AddProductForm from "./components/AddProductForm/AddProductForm";
import EditProductForm from "./components/EditProductForm/EditProductForm";
import RuleModal from "./components/ProductTable/RuleModal/RuleModal";
import useFetch from "./hooks/useFetch";
import {
    handleEditRule,
    handleUpdateRule,
    handleDeleteRule,
    handleColorChange
} from "./utils/ruleHandlers";
import { updateData } from "./utils/apiUtils"; // Ensure updateData is imported
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

    const { data: fetchedRules, loading } = useFetch(`${process.env.REACT_APP_API_URL}/rules`);

    useEffect(() => {
        if (!loading && fetchedRules) {
            setRules(fetchedRules);
        }
    }, [fetchedRules, loading]);

    const handleToggleRuleList = () => {
        setShowRuleList(!showRuleList);
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

    const openRuleModal = (rule = null) => {
        setCurrentRule(rule);
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
                setEditingProduct={setEditingProduct} // Pass setEditingProduct to ProductTable
                openRuleModal={openRuleModal} // Pass openRuleModal to ProductTable
            />
            {showProductManager && <AddProductForm onClose={() => setShowProductManager(false)} />}
            {editingProduct && (
                <EditProductForm
                    product={editingProduct}
                    onClose={handleEditFormClose}
                    onUpdateProduct={handleUpdateProduct} // Ensure handleUpdateProduct is defined
                />
            )}
            {showRuleList && (
                <div className={styles.ruleContainer}>
                    <RuleList
                        rules={rules}
                        openRuleModal={openRuleModal} // Pass openRuleModal to RuleList
                        handleDelete={(id) => handleDeleteRule(id, setRules)}
                    />
                </div>
            )}
            {isRuleModalOpen && (
                <RuleModal
                    currentProduct={editingProduct}
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
