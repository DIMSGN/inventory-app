import React from "react";
import CustomDropdown from "../common/RuleManagerDropdown/RuleManagerDropdown"; // Correct import path
import styles from "./RuleForm.module.css";

/**
 * RuleForm Component
 * This component renders a form to add or edit a rule.
 * 
 * Props:
 * - formData: The form data object containing rule details.
 * - handleChange: Function to handle input changes.
 * - handleSubmit: Function to handle form submission.
 * - editingRule: The rule being edited (if any).
 * - setEditingRule: Function to clear the editing rule.
 * - colors: Array of color options for the dropdown.
 */
const RuleForm = ({ formData, handleChange, handleSubmit, editingRule, setEditingRule, colors }) => {
    const comparators = [
        { text: "equals", symbol: "=" },
        { text: "not equals", symbol: "!=" },
        { text: "greater than", symbol: ">" },
        { text: "less than", symbol: "<" },
        { text: "greater than or equal to", symbol: ">=" },
        { text: "less than or equal to", symbol: "<=" }
    ];

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
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
                        <option value="">Select a comparator</option>
                        {comparators.map((comparator) => (
                            <option key={comparator.symbol} value={comparator.symbol}>
                                {comparator.text} ({comparator.symbol})
                            </option>
                        ))}
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
                    <CustomDropdown
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        options={colors}
                    />
                </label>
            </div>
            <div className={styles.buttonGroup}>
                <button type="submit">{editingRule ? "Update Rule" : "Add Rule"}</button>
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