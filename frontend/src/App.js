import React, { useState, useContext, useEffect } from "react";
import { ProductContext } from "./context/ProductContext";
import Header from "./components/Header/Header";
import ProductTable from "./components/ProductTable/ProductTable";
import RuleList from "./components/RuleList/RuleList";
import AddProductForm from "./components/AddProductForm/AddProductForm";
import EditProductForm from "./components/EditProductForm/EditProductForm";
import RuleForm from "./components/RuleForm/RuleForm";
import useFetch from "./hooks/useFetch";
import {
    handleAddRule,
    handleEditRule,
    handleUpdateRule,
    handleDeleteRule,
    handleColorChange,
    validateProductName
} from "./utils/ruleHandlers";
import { updateData } from "./utils/apiUtils"; // Ensure updateData is imported
import styles from "./App.css";

const App = () => {
    const [showProductManager, setShowProductManager] = useState(false);
    const [showRuleList, setShowRuleList] = useState(false);
    const [rules, setRules] = useState([]);
    const [currentRule, setCurrentRule] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const { editingProduct, setEditingProduct, fetchProducts, categories, products } = useContext(ProductContext);

    const { data: fetchedRules, loading, error } = useFetch(`${process.env.REACT_APP_API_URL}/rules`);

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
                        handleEdit={(rule) => handleEditRule(rule, setCurrentRule, setShowForm)}
                        handleDelete={(id) => handleDeleteRule(id, setRules)}
                    />
                </div>
            )}
            {showForm && (
                <RuleForm
                    formData={currentRule}
                    handleChange={(e) => setCurrentRule({ ...currentRule, [e.target.name]: e.target.value })}
                    handleSubmit={(e) => handleUpdateRule(currentRule, setRules, setCurrentRule, setShowForm)}
                    setFormData={setCurrentRule}
                    setEditingRule={setCurrentRule}
                    products={products}
                    handleColorChange={(selectedOption) => handleColorChange(selectedOption, setCurrentRule)}
                    rules={rules} 
                />
            )}
        </div>
    );
};

export default App;
