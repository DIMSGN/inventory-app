import React from "react";
import PropTypes from "prop-types";
import styles from "./Button.module.css";

const Button = ({ type = "button", onClick, children, variant = "primary" }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${styles.button} ${styles[variant]}`}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    type: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(["primary", "edit", "delete"]),
};

export default Button;