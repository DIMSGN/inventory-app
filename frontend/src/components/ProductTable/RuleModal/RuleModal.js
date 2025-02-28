import React from "react";
import RuleForm from "../../RuleForm/RuleForm"; // Import RuleForm
import styles from "./RuleModal.module.css";

const RuleModal = ({ currentProduct, formData, handleChange, handleSubmit, setIsRuleModalOpen }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Add Rule for {currentProduct.product_name}</h2>
                <RuleForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    setFormData={null} // No need to clear form data in modal
                    setEditingRule={null} // No need to handle editing rule in modal
                />
                <button type="button" onClick={() => setIsRuleModalOpen(false)}>Cancel</button>
            </div>
        </div>
    );
};

export default RuleModal;