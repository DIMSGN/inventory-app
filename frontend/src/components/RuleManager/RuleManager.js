import React, { useState, useEffect } from "react";
import RuleForm from "../RuleForm/RuleForm";
import RuleList from "../RuleList/RuleList";
import { colors } from "../../utils/colors"; // Import colors from utils
import useFetch from "../../hooks/useFetch"; // Import useFetch hook
import ruleService from "../../services/ruleService"; // Import ruleService
import styles from "./RuleManager.module.css";

const RuleManager = () => {
    const [rules, setRules] = useState([]);
    const [currentRule, setCurrentRule] = useState(null);

    const { data: fetchedRules, loading, error } = useFetch("/rules");

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
            await ruleService.updateRule(updatedRule.rules, updatedRule.comparison, updatedRule.amount, updatedRule);
            setRules(rules.map(r => (r.rules === updatedRule.rules && r.comparison === updatedRule.comparison && r.amount === updatedRule.amount ? updatedRule : r)));
            setCurrentRule(null);
        } catch (error) {
            console.error("Error updating rule:", error);
        }
    };

    const handleDeleteRule = async (rules, comparison, amount) => {
        try {
            await ruleService.deleteRule(rules, comparison, amount);
            setRules(rules.filter(r => !(r.rules === rules && r.comparison === comparison && r.amount === amount)));
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
                <h2 className={styles.title}>Rule Form</h2> {/* Add title for Rule Form */}
                <RuleForm
                    formData={currentRule || { rules: "", comparison: "", amount: "", color: "" }}
                    handleChange={(e) => setCurrentRule({ ...currentRule, [e.target.name]: e.target.value })}
                    handleSubmit={(e) => {
                        e.preventDefault();
                        if (currentRule && currentRule.rules && currentRule.comparison && currentRule.amount) {
                            handleUpdateRule(currentRule);
                        } else {
                            handleAddRule(currentRule);
                        }
                    }}
                    editingRule={currentRule}
                    setEditingRule={setCurrentRule}
                    colors={colors} // Use imported colors
                />
            </div>
            <div className={styles.listContainer}>
                <h2 className={styles.title}>Rule List</h2> {/* Add title for Rule List */}
                <RuleList rules={rules} handleEdit={handleEditRule} handleDelete={handleDeleteRule} />
            </div>
        </div>
    );
};

export default RuleManager;