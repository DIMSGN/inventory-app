import React, { useState } from "react";
import styles from "./RuleForm.module.css";
import { colors } from "../../utils/colors";
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
        console.log("Form data before submission:", formData); // Debugging log
        if (!formData.product_id) {
            setError("Invalid product name. Please enter a valid product name.");
            window.alert("Invalid product name. Please enter a valid product name.");
            return;
        }
        handleSubmit(e);
    };

    const handleProductNameChange = (e) => {
        const productName = e.target.value;
        const matchedProduct = products.find(product => product.product_name === productName);

        setFormData({
            ...formData,
            product_name: productName,
            product_id: matchedProduct ? matchedProduct.product_id : ""
        });

        if (!matchedProduct) {
            setError("Invalid product name. Please select a valid product.");
        } else {
            setError("");
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className={styles.form}>
            <label>
                Product Name:
                <input
                    type="text"
                    name="product_name"
                    value={formData.product_name || ""}
                    onChange={handleProductNameChange} // Use the new handler here
                    required
                    placeholder="Enter the product name"
                    title="Enter the product name for the rule."
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
                    onChange={handleColorChange} // Use the prop here
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
                    <Button
                        type="button"
                        onClick={() => setFormData({
                            product_name: "",
                            comparison: "=",
                            amount: "",
                            color: "",
                            product_id: ""
                        })}
                        variant="primary"
                    >
                        Clear
                    </Button>
                )}
            </div>
        </form>
    );
};

export default AddRuleForm;