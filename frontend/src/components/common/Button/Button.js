import React from "react";
import styles from "./Button.module.css";

const Button = ({ onClick, children, className, ...props }) => {
    return (
        <button onClick={onClick} className={`${styles.button} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;