import React from "react";
import PropTypes from "prop-types";
import styles from "./Button.module.css";
import Icon from "../Icon";

const Button = ({ 
    type = "button", 
    onClick, 
    children, 
    variant = "primary", 
    title, 
    icon,
    disabled = false
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${styles.button} ${styles[variant]}`}
            title={title}
            disabled={disabled}
        >
            {icon && <Icon className={icon} style={{ marginRight: children ? '8px' : 0 }} />}
            {children}
        </button>
    );
};

Button.propTypes = {
    type: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(["primary", "secondary", "success", "edit", "delete", "ruleButton"]),
    title: PropTypes.string,
    icon: PropTypes.string,
    disabled: PropTypes.bool
};

export default Button;