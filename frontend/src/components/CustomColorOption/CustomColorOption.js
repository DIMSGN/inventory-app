import React from "react";
import styles from "./CustomColorOption.module.css";

const CustomColorOption = ({ innerRef, innerProps, data }) => {
    return (
        <div ref={innerRef} {...innerProps} className={styles.option}>
            <span className={styles.colorBox} style={{ backgroundColor: data.value }}></span>
            {data.label}
        </div>
    );
};

export default CustomColorOption;