import React from "react";
import styles from "./Button.module.css";

const Button = ({ className, onClick, children }) => {
    return (
        <button className={`${styles.button} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;