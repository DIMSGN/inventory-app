import React, { useState } from "react";
import Select from "react-select";
import styles from "./RuleForm.module.css";
import { colors } from "../../utils/colors";
import ProductTableDropdown from "../ProductTable/ProductTableDropdown/ProductTableDropdown";

const EditRuleForm = ({ formData, handleChange, handleSubmit, setFormData, setEditingRule, products, handleColorChange, rules }) => {
    const [error, setError] = useState("");

    const colorOptions = colors.map(color => ({
        value: color.value,
        label: color.name
    }));

    // Filter rules to include only those associated with the product being edited
    const dropdownOptions = rules.filter(rule => rule.product_id === formData.product_id).map(rule => ({
        id: rule.id,
        name: rule.rules,
        comparison: rule.comparison,
        amount: rule.amount,
        value: rule.color
    }));

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!formData.product_id) {
            setError("Invalid product name. Please enter a valid product name.");
            window.alert("Invalid product name. Please enter a valid product name.");
            return;
        }
        handleSubmit(e);
    };

    const handleRuleChange = (selectedOption) => {
        setFormData(prevData => ({ ...prevData, rules: selectedOption.id }));
    };

    return (
        <form onSubmit={handleFormSubmit} className={styles.form}>
            <label>
                Rule:
                <ProductTableDropdown
                    name="rules"
                    value={rules.find(rule => rule.product_id === formData.product_id && rule.id === formData.rules)?.id || ""}
                    onChange={handleRuleChange}
                    options={dropdownOptions}
                />
                {error && <span className={styles.error}>{error}</span>}
            </label>
            <label>
                Comparison:
                <select
                    name="comparison"
                    value={formData.comparison}
                    onChange={handleChange}
                    required
                    title="Select the comparison operator."
                >
                    <option value="=">=</option>
                    <option value="<">&lt;</option>
                    <option value=">">&gt;</option>
                    <option value="<=">&lt;=</option>
                    <option value=">=">&gt;=</option>
                </select>
            </label>
            <label>
                Amount:
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    placeholder="Enter the amount"
                    title="Enter the amount for the rule."
                />
            </label>
            <label>
                Color:
                <Select
                    name="color"
                    value={colorOptions.find(option => option.value === formData.color)}
                    onChange={handleColorChange}
                    options={colorOptions}
                    className={styles.select}
                    placeholder="Select a color"
                    title="Select a color for the rule."
                    isSearchable={false} // Disable text input
                />
            </label>
            <input
                type="hidden"
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
            />
            <div className={styles.buttonGroup}>
                <button type="submit">Save</button>
                {setEditingRule && (
                    <button type="button" onClick={() => setEditingRule(null)}>
                        Cancel
                    </button>
                )}
                {setFormData && (
                    <button type="button" onClick={() => setFormData({
                        rules: "",
                        comparison: "=",
                        amount: "",
                        color: "",
                        product_id: formData.product_id
                    })}>
                        Clear
                    </button>
                )}
            </div>
        </form>
    );
};

export default EditRuleForm;