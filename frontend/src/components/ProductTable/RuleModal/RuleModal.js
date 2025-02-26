import React from "react";
import Select from "react-select";
import styles from "./RuleModal.module.css";
import { colors } from "../../../utils/colors"; // Import colors

const RuleModal = ({ currentProduct, formData, handleChange, handleSubmit, setIsRuleModalOpen }) => {
    const colorOptions = colors.map(color => ({
        value: color.value,
        label: color.name
    }));

    const handleColorChange = selectedOption => {
        handleChange({ target: { name: "color", value: selectedOption.value } });
    };

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

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Add Rule for {currentProduct.product_name}</h2>
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
                        />
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