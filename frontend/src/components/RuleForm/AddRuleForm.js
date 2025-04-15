import React, { useState } from "react";
import styles from "./RuleForm.module.css";
import { colors } from "../../utils/colors";
import ColorSelect from "../common/ColorSelect/ColorSelect"; // Updated import
import Button from "../common/Button/Button"; // Updated import

const AddRuleForm = ({ product_id, product_name, formData, handleChange, handleSubmit, handleColorChange }) => {
    const [error, setError] = useState("");

    // Add this definition for colorOptions
    const colorOptions = colors.map(color => ({
        value: color.value,
        label: color.name
    }));

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log("Form data before submission:", formData); // Debugging log
        if (!formData?.rules || !formData?.comparison || !formData?.amount || !formData?.color) {
            setError("All fields except product_id are required.");
            return;
        }
        handleSubmit({ ...formData, product_id }); // Include product_id in the submission
    };

    return (
        <form onSubmit={handleFormSubmit} className={styles.form}>
            <label>
                Product Name:
                <input
                    type="text"
                    name="product_name"
                    value={product_name || ""}
                    readOnly
                    disabled
                />
            </label>
            <label>
                Product ID:
                <input
                    type="text"
                    name="product_id"
                    value={product_id || ""}
                    readOnly
                    disabled
                />
            </label>
            <label>
                Rule Name:
                <input
                    type="text"
                    name="rules"
                    value={formData?.rules || ""}
                    onChange={handleChange}
                    required
                    placeholder="Enter the rule name"
                />
            </label>
            <label>
                Comparison:
                <select
                    name="comparison"
                    value={formData?.comparison || "="}
                    onChange={handleChange}
                    required
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
                    value={formData?.amount || ""}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Color:
                <ColorSelect
                    name="color"
                    value={formData?.color || "#ff0000"}
                    onChange={handleColorChange}
                    options={colorOptions}
                />
            </label>
            <Button type="submit" variant="primary">Save Rule</Button>
        </form>
    );
};

export default AddRuleForm;