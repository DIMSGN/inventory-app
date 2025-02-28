import React, { useState, useEffect, useContext } from "react";
import RuleList from "../RuleList/RuleList";
import RuleForm from "../RuleForm/RuleForm"; // Import RuleForm
import { colors } from "../../utils/colors"; // Import colors from utils
import useFetch from "../../hooks/useFetch"; // Import useFetch hook
import ruleService from "../../services/ruleService"; // Import ruleService
import { ProductContext } from "../../context/ProductContext";
import styles from "./RuleManager.module.css";

const RuleManager = () => {
    const [rules, setRules] = useState([]);
    const [currentRule, setCurrentRule] = useState(null);
    const [showForm, setShowForm] = useState(false); // State to control form visibility
    const { fetchProducts, categories, products } = useContext(ProductContext);

    const { data: fetchedRules, loading, error } = useFetch(`${process.env.REACT_APP_API_URL}/rules`);

    useEffect(() => {
        if (!loading && fetchedRules) {
            setRules(fetchedRules);
        }
    }, [fetchedRules, loading]);

    const handleAddRule = async (rule) => {
        try {
            await ruleService.addRule(rule);
            setRules([...rules, rule]);
            setShowForm(false); // Hide form after adding rule
        } catch (error) {
            console.error("Error adding rule:", error);
        }
    };

    const handleEditRule = (rule) => {
        setCurrentRule(rule);
        setShowForm(true); // Show form when editing rule
    };

    const handleUpdateRule = async (updatedRule) => {
        try {
            await ruleService.updateRule(updatedRule.id, updatedRule);
            setRules(rules.map(r => (r.id === updatedRule.id ? updatedRule : r)));
            setCurrentRule(null);
            setShowForm(false); // Hide form after updating rule
        } catch (error) {
            console.error("Error updating rule:", error);
        }
    };

    const handleDeleteRule = async (id) => {
        try {
            await ruleService.deleteRule(id);
            setRules(rules.filter(r => r.id !== id));
        } catch (error) {
            console.error("Error deleting rule:", error);
        }
    };

    const validateProductName = (name) => {
        return products.some(product => product.product_name === name);
    };

    const handleColorChange = (selectedOption) => {
        setCurrentRule((prevRule) => ({
            ...prevRule,
            color: selectedOption.value
        }));
    };

    const handleShowForm = () => {
        setCurrentRule({ rules: "", comparison: "=", amount: "", color: "", product_id: "" });
        setShowForm(true);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className={styles.ruleManager}>
            <div className={styles.formContainer}>
                <h2 className={styles.title}>Rule Form</h2>
                <button onClick={handleShowForm}>Add Rule</button>
                {showForm && (
                    <RuleForm
                        formData={currentRule || { rules: "", comparison: "=", amount: "", color: "", product_id: "" }}
                        handleChange={(e) => setCurrentRule((prev) => ({ ...(prev || {}), [e.target.name]: e.target.value }))}
                        handleSubmit={(e) => {
                            e.preventDefault();
                            if (currentRule && currentRule.id) {
                                handleUpdateRule(currentRule);
                            } else {
                                handleAddRule(currentRule);
                            }
                        }}
                        setFormData={setCurrentRule}
                        setEditingRule={setCurrentRule}
                        products={products} // Pass the list of products
                        handleColorChange={handleColorChange} // Pass the handleColorChange function
                    />
                )}
            </div>
            <div className={styles.listContainer}>
                <h2 className={styles.title}>Rule List</h2>
                <RuleList rules={rules || []} handleEdit={handleEditRule} handleDelete={handleDeleteRule} />
            </div>
        </div>
    );
};

export default RuleManager;