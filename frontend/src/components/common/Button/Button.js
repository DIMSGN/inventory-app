import React from "react";
import PropTypes from "prop-types";
import styles from "./Button.module.css";

const Button = ({ type, onClick, children, variant }) => {
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

Button.defaultProps = {
    type: "button",
    variant: "primary",
};

export default Button;