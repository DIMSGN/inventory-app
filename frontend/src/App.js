import React, { useState, useContext, useEffect } from "react";
import { ProductContext } from "./context/ProductContext";
import Header from "./components/Header/Header";
import ProductTable from "./components/ProductTable/ProductTable";
import RuleForm from "./components/RuleForm/RuleForm";
import RuleList from "./components/RuleList/RuleList";
import ProductManager from "./components/ProductManager/ProductManager";
import EditProductForm from "./components/EditProductForm/EditProductForm";
import useFetch from "./hooks/useFetch";
import {
    handleAddRule,
    handleEditRule,
    handleUpdateRule,
    handleDeleteRule,
    handleColorChange,
    validateProductName
} from "./utils/ruleHandlers";
import styles from "./App.css";

const App = () => {
    const [showProductManager, setShowProductManager] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showRuleList, setShowRuleList] = useState(false);
    const [rules, setRules] = useState([]);
    const [currentRule, setCurrentRule] = useState(null);
    const { editingProduct, fetchProducts, categories, products } = useContext(ProductContext);

    const { data: fetchedRules, loading, error } = useFetch(`${process.env.REACT_APP_API_URL}/rules`);

    useEffect(() => {
        if (!loading && fetchedRules) {
            setRules(fetchedRules);
        }
    }, [fetchedRules, loading]);

    const handleShowForm = () => {
        setCurrentRule({ rules: "", comparison: "=", amount: "", color: "", product_id: "" });
        setShowForm(true);
    };

    const handleHideForm = () => {
        setShowForm(false);
    };

    const handleToggleRuleList = () => {
        setShowRuleList(!showRuleList);
    };

    return (
        <div className={styles.container}>
            <Header />
            <ProductTable onAddProductClick={() => setShowProductManager(true)} />
            {showProductManager && <ProductManager onClose={() => setShowProductManager(false)} />}
            {editingProduct && <EditProductForm />}
            <div className={styles.controls}>
                <button onClick={handleShowForm}>Add Rule</button>
                <button onClick={handleToggleRuleList}>{showRuleList ? "Hide Rule List" : "Show Rule List"}</button>
            </div>
            <div className={styles.ruleContainer}>
                {showForm && (
                    <RuleForm
                        formData={currentRule || { rules: "", comparison: "=", amount: "", color: "", product_id: "" }}
                        handleChange={(e) => setCurrentRule((prev) => ({ ...(prev || {}), [e.target.name]: e.target.value }))}
                        handleSubmit={(e) => {
                            e.preventDefault();
                            if (currentRule && currentRule.id) {
                                handleUpdateRule(currentRule, setRules, setCurrentRule, setShowForm);
                            } else {
                                handleAddRule(currentRule, setRules, setShowForm);
                            }
                        }}
                        setFormData={setCurrentRule}
                        setEditingRule={setCurrentRule}
                        products={products} // Pass the list of products
                        handleColorChange={(selectedOption) => handleColorChange(selectedOption, setCurrentRule)} // Pass the handleColorChange function
                    />
                )}
                {showRuleList && (
                    <RuleList rules={rules} handleEdit={(rule) => handleEditRule(rule, setCurrentRule, setShowForm)} handleDelete={(id) => handleDeleteRule(id, setRules)} />
                )}
            </div>
        </div>
    );
};

export default App;
