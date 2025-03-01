import React, { useState, useEffect } from "react";
import Select from "react-select";
import styles from "./RuleForm.module.css";
import { colors } from "../../utils/colors"; // Import colors

const RuleForm = ({ formData, handleChange, handleSubmit, setFormData, setEditingRule, products, handleColorChange }) => {
    const [error, setError] = useState("");

    const colorOptions = colors.map(color => ({
        value: color.value,
        label: color.name
    }));

    const customSingleValue = ({ data }) => (
        <div className={styles.singleValue}>
            <span className={styles.colorBox} style={{ backgroundColor: data.value }}></span>
            {data.label}
        </div>
    );

    const customOption = ({ innerRef, innerProps, data, isFocused }) => (
        <div ref={innerRef} {...innerProps} className={`${styles.option} ${isFocused ? styles.optionFocused : ''}`}>
            <span className={styles.colorBox} style={{ backgroundColor: data.value }}></span>
            {data.label}
        </div>
    );

    const handleProductNameChange = (e) => {
        const productName = e.target.value;
        handleChange(e);

        if (products) {
            const product = products.find(p => p.product_name === productName);
            if (product) {
                setFormData(prev => ({ ...prev, product_id: product.product_id }));
                setError("");
            } else {
                setFormData(prev => ({ ...prev, product_id: "" }));
                setError("Invalid product name. Please enter a valid product name.");
            }
        } else {
            setError("Products list is not available.");
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!formData.product_id) {
            setError("Invalid product name. Please enter a valid product name.");
            window.alert("Invalid product name. Please enter a valid product name."); // Display alert to the user
            return;
        }
        console.log("Submitting form data:", formData); // Log form data
        handleSubmit(e);
    };

    return (
        <form onSubmit={handleFormSubmit} className={styles.form}>
            <label>
                Rule:
                <input
                    type="text"
                    name="rules"
                    value={formData.rules}
                    onChange={handleProductNameChange}
                    required
                    title="Enter the product name for the rule."
                    placeholder="Product name"
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
                    components={{ SingleValue: customSingleValue, Option: customOption }}
                    className={styles.select}
                    styles={{
                        control: (base) => ({
                            ...base,
                            border: '1px solid #ccc',
                            boxShadow: 'none',
                            '&:hover': {
                                border: '1px solid #aaa'
                            }
                        }),
                        dropdownIndicator: (base) => ({
                            ...base,
                            padding: '0 8px'
                        }),
                        indicatorSeparator: () => ({
                            display: 'none'
                        })
                    }}
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
                        product_id: formData.product_id // Ensure product_id is included
                    })}>
                        Clear
                    </button>
                )}
            </div>
        </form>
    );
};

export default RuleForm;