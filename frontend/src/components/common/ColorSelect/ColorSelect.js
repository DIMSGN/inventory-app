import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import styles from "./ColorSelect.module.css";
import { colors } from "../../../utils/colors"; 

const ColorSelect = ({ name, value, onChange }) => {
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

    return (
        <Select
            name={name}
            value={colorOptions.find(option => option.value === value)}
            onChange={onChange}
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
    );
};

ColorSelect.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

export default ColorSelect;