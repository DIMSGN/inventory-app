import React from "react";
import styles from "./RuleModal.module.css";
import RuleForm from "../../RuleForm/RuleForm";

const RuleModal = ({ currentProduct, formData, handleChange, handleSubmit, colors, setIsRuleModalOpen }) => {
    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h3>Add Rule for {currentProduct.product_name}</h3>
                <RuleForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    colors={colors}
                />
                <button className={styles.closeButton} onClick={() => setIsRuleModalOpen(false)}>Close</button>
            </div>
        </div>
    );
};

export default RuleModal;