import React from "react";
import styles from "./ProductModal.module.css";

const ProductModal = ({ title, children, onClose }) => {
    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={onClose}>&times;</span>
                <h2>{title}</h2>
                {children}
            </div>
        </div>
    );
};

export default ProductModal;