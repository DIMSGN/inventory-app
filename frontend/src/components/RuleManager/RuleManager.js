import React, { useState, useEffect, useContext } from "react";
import RuleForm from "../RuleForm/RuleForm";
import RuleList from "../RuleList/RuleList";
import { colors } from "../../utils/colors"; // Import colors from utils
import useFetch from "../../hooks/useFetch"; // Import useFetch hook
import ruleService from "../../services/ruleService"; // Import ruleService
import { ProductContext } from "../../context/ProductContext";
import styles from "./RuleManager.module.css";

const RuleManager = () => {
    const [rules, setRules] = useState([]);
    const [currentRule, setCurrentRule] = useState(null);
    const { fetchProducts, categories } = useContext(ProductContext);

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
        } catch (error) {
            console.error("Error adding rule:", error);
        }
    };

    const handleEditRule = (rule) => {
        setCurrentRule(rule);
    };

    const handleUpdateRule = async (updatedRule) => {
        try {
            await ruleService.updateRule(updatedRule.id, updatedRule); // Ensure correct parameters
            setRules(rules.map(r => (r.id === updatedRule.id ? updatedRule : r))); // Ensure correct comparison
            setCurrentRule(null);
        } catch (error) {
            console.error("Error updating rule:", error);
        }
    };

    const handleDeleteRule = async (id) => {
        try {
            await ruleService.deleteRule(id); // Ensure correct parameter
            setRules(rules.filter(r => r.id !== id)); // Ensure correct comparison
        } catch (error) {
            console.error("Error deleting rule:", error);
        }
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
                <RuleForm
                    formData={currentRule || { rules: "", comparison: "", amount: "", color: "", product_id: "" }}
                    handleChange={(e) => setCurrentRule({ ...currentRule, [e.target.name]: e.target.value })}
                    handleSubmit={(e) => {
                        e.preventDefault();
                        if (currentRule && currentRule.id) {
                            handleUpdateRule(currentRule);
                        } else {
                            handleAddRule(currentRule);
                        }
                    }}
                    editingRule={currentRule}
                    setEditingRule={setCurrentRule}
                    colors={colors}
                />
            </div>
            <div className={styles.listContainer}>
                <h2 className={styles.title}>Rule List</h2>
                <RuleList rules={rules} handleEdit={handleEditRule} handleDelete={handleDeleteRule} />
            </div>
        </div>
    );
};

export default RuleManager;