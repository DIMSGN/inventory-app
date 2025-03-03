import React from "react";
import RuleForm from "../../RuleForm/RuleForm";
import styles from "./RuleModal.module.css";

const RuleModal = ({ currentProduct, formData, handleChange, handleSubmit, setIsRuleModalOpen, products, rules, setFormData }) => {
    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={() => setIsRuleModalOpen(false)}>&times;</span>
                <h2>Edit Rule for {currentProduct.product_name}</h2>
                <RuleForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    setFormData={setFormData} // Ensure setFormData is defined
                    products={products}
                    rules={rules} // Ensure rules is passed correctly
                />
            </div>
        </div>
    );
};

export default RuleModal;