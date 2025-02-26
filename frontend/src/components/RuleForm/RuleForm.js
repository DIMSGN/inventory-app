import React from "react";
import styles from "./RuleForm.module.css";

const RuleForm = ({ formData, handleChange, handleSubmit, editingRule, setEditingRule, colors }) => {
    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <label>
                Rule:
                <input
                    type="text"
                    name="rules"
                    value={formData.rules}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Comparison:
                <select
                    name="comparison"
                    value={formData.comparison}
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
                    value={formData.amount}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Color:
                <select
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    required
                >
                    {colors.map((color) => (
                        <option key={color} value={color}>
                            {color}
                        </option>
                    ))}
                </select>
            </label>
            {/* Hidden input field for product_id */}
            <input
                type="hidden"
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
            />
            <div className={styles.buttonGroup}>
                <button type="submit">Save</button>
                {editingRule && (
                    <button type="button" onClick={() => setEditingRule(null)}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default RuleForm;