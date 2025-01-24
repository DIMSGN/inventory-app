import React, { useState, useEffect } from "react";
import axios from "axios";
import RuleForm from "../RuleForm/RuleForm";
import RuleList from "../RuleList/RuleList";
import styles from "./RuleManager.module.css";

/**
 * RuleManager Component
 * This component manages the rules associated with products.
 * It allows users to add, edit, and delete rules.
 */
const RuleManager = () => {
    const [rules, setRules] = useState([]);
    const [editingRule, setEditingRule] = useState(null);
    const [formData, setFormData] = useState({
        rules: "",
        comparison: "",
        amount: "",
        color: ""
    });

    const colors = [
        { name: "Red", value: "#ff0000" },
        { name: "Green", value: "#00ff00" },
        { name: "Blue", value: "#0000ff" },
        { name: "Yellow", value: "#ffff00" },
        { name: "Orange", value: "#ffa500" },
        { name: "Purple", value: "#800080" },
        { name: "Pink", value: "#ffc0cb" },
        { name: "Brown", value: "#a52a2a" },
        { name: "Gray", value: "#808080" },
        { name: "Black", value: "#000000" }
    ];

    // Fetch rules from the server
    const fetchRules = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/rules");
            setRules(response.data);
        } catch (error) {
            console.error("Error fetching rules:", error);
        }
    };

    // Fetch rules when the component mounts
    useEffect(() => {
        fetchRules();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingRule) {
            // Update existing rule
            try {
                await axios.put(`http://localhost:5000/api/rules/${editingRule.id}`, formData);
                fetchRules();
                setEditingRule(null);
                setFormData({ rules: "", comparison: "", amount: "", color: "" });
            } catch (error) {
                console.error("Error updating rule:", error);
            }
        } else {
            // Add new rule
            try {
                await axios.post("http://localhost:5000/api/rules", formData);
                fetchRules();
                setFormData({ rules: "", comparison: "", amount: "", color: "" });
            } catch (error) {
                console.error("Error adding rule:", error);
            }
        }
    };

    // Handle edit button click
    const handleEdit = (rule) => {
        setEditingRule(rule);
        setFormData({
            rules: rule.rules,
            comparison: rule.comparison,
            amount: rule.amount,
            color: rule.color
        });
    };

    // Handle delete button click
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/rules/${id}`);
            fetchRules();
        } catch (error) {
            console.error("Error deleting rule:", error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h2 className={styles.heading}>Manage Rules</h2>
                <RuleForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    editingRule={editingRule}
                    setEditingRule={setEditingRule}
                    colors={colors}
                />
            </div>
            <div className={styles.listContainer}>
                <h2 className={styles.heading}>Rule List</h2>
                <RuleList
                    rules={rules}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default RuleManager;