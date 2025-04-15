import React from "react";
import Modal from "../../common/Modal/Modal";
import styles from "./ProductModal.module.css";

const ProductModal = ({ title, children, onClose, isOpen = true }) => {
    return (
        <Modal
            isOpen={isOpen}
            title={title}
            onClose={onClose}
            className={styles.productModal}
        >
            <div className={styles.productModalContent}>
                {children}
            </div>
        </Modal>
    );
};

export default ProductModal;