import React from "react";
import styles from "./RuleModal.module.css";

const RuleModal = ({ currentProduct, formData, handleChange, handleSubmit, colors, setIsRuleModalOpen }) => {
    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2>Add/Edit Rule for {currentProduct.product_name}</h2>
                <form onSubmit={handleSubmit}>
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
                    <div className={styles.buttonGroup}>
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setIsRuleModalOpen(false)}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RuleModal;