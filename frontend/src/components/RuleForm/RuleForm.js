import React from "react";
import Select from "react-select";
import styles from "./RuleForm.module.css";
import { colors } from "../../utils/colors"; // Import colors

const RuleForm = ({ formData, handleChange, handleSubmit, editingRule, setEditingRule }) => {
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