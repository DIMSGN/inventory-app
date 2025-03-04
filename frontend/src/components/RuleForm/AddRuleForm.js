import React, { useState } from "react";
import styles from "./RuleForm.module.css";
import { colors } from "../../utils/colors";
import ProductTableDropdown from "../ProductTable/ProductTableDropdown/ProductTableDropdown";
import ColorSelect from "../common/ColorSelect/ColorSelect"; // Updated import
import Button from "../common/Button/Button"; // Updated import

const AddRuleForm = ({ formData, handleChange, handleSubmit, setFormData, products, handleColorChange, rules }) => {
    const [error, setError] = useState("");

    const colorOptions = colors.map(color => ({
        value: color.value,
        label: color.name
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

    const handleRuleChange = (e) => {
        const selectedRule = e.target.value;
        setFormData(selectedRule);
    };

    return (
        <form onSubmit={handleFormSubmit} className={styles.form}>
            <label>
                Rule:
                <ProductTableDropdown
                    name="rules"
                    value={formData}
                    onChange={handleRuleChange}
                    options={rules}
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

export default AddRuleForm;