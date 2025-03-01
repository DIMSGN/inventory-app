import React, { useState, useContext, useEffect } from "react";
import { ProductContext } from "./context/ProductContext";
import Header from "./components/Header/Header";
import ProductTable from "./components/ProductTable/ProductTable";
import RuleList from "./components/RuleList/RuleList";
import AddProductForm from "./components/AddProductForm/AddProductForm"; // Updated import
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
    const [showRuleList, setShowRuleList] = useState(false);
    const [rules, setRules] = useState([]);
    const [currentRule, setCurrentRule] = useState(null);
    const [showForm, setShowForm] = useState(false); // Add state for showing form
    const { editingProduct, fetchProducts, categories, products } = useContext(ProductContext);

    const { data: fetchedRules, loading, error } = useFetch(`${process.env.REACT_APP_API_URL}/rules`);

    useEffect(() => {
        if (!loading && fetchedRules) {
            setRules(fetchedRules);
        }
    }, [fetchedRules, loading]);

    const handleToggleRuleList = () => {
        setShowRuleList(!showRuleList);
    };

    return (
        <div className={styles.container}>
            <Header />
            <ProductTable
                onAddProductClick={() => setShowProductManager(true)}
                onToggleRuleList={handleToggleRuleList} // Pass the handler to ProductTable
                showRuleList={showRuleList} // Pass the state to ProductTable
            />
            {showProductManager && <AddProductForm onClose={() => setShowProductManager(false)} />}
            {editingProduct && <EditProductForm />}
            {showRuleList && (
                <div className={styles.ruleContainer}>
                    <RuleList
                        rules={rules}
                        handleEdit={(rule) => handleEditRule(rule, setCurrentRule, setShowForm)}
                        handleDelete={(id) => handleDeleteRule(id, setRules)}
                    />
                </div>
            )}
        </div>
    );
};

export default App;
