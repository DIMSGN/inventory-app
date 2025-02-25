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

    const { data: fetchedRules, loading } = useFetch("http://localhost:5000/api/rules");

    useEffect(() => {
        if (!loading) {
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
            await ruleService.updateRule(updatedRule.id, updatedRule);
            setRules(rules.map(r => (r.id === updatedRule.id ? updatedRule : r)));
            setCurrentRule(null);
        } catch (error) {
            console.error("Error updating rule:", error);
        }
    };

    const handleDeleteRule = async (ruleId) => {
        try {
            await ruleService.deleteRule(ruleId);
            setRules(rules.filter(r => r.id !== ruleId));
        } catch (error) {
            console.error("Error deleting rule:", error);
        }
    };

    return (
        <div className={styles.ruleManager}>
            <div className={styles.formContainer}>
                <h2 className={styles.title}>Rule Form</h2> {/* Add title for Rule Form */}
                <RuleForm
                    formData={currentRule || { rules: "", comparison: "", amount: "", color: "" }}
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