import React, { useState } from "react";
import styles from "./RuleForm.module.css";
import { colors } from "../../utils/colors";
import ProductTableDropdown from "../ProductTable/ProductTableDropdown/ProductTableDropdown";
import ColorSelect from "../common/ColorSelect/ColorSelect"; // Updated import
import Button from "../common/Button/Button"; // Updated import

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
        const selectedRule = rules.find(rule => rule.id === selectedOption.id);
        setFormData({
            rules: selectedRule.id,
            comparison: selectedRule.comparison,
            amount: selectedRule.amount,
            color: selectedRule.color,
            product_id: selectedRule.product_id
        });
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
                <ColorSelect
                    name="color"
                    value={formData.color}
                    onChange={handleColorChange}
                    options={colorOptions}
                />
            </label>
            <input
                type="hidden"
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
            />
            <div className={styles.buttonGroup}>
                <Button type="submit" variant="primary">Save</Button>
                {setEditingRule && (
                    <Button type="button" onClick={() => setEditingRule(null)} variant="primary">
                        Cancel
                    </Button>
                )}
                {setFormData && (
                    <Button type="button" onClick={() => setFormData({
                        rules: "",
                        comparison: "=",
                        amount: "",
                        color: "",
                        product_id: formData.product_id
                    })} variant="primary">
                        Clear
                    </Button>
                )}
            </div>
        </form>
    );
};

export default EditRuleForm;