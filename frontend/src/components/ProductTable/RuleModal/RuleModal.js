import React from "react";
import AddRuleForm from "../../RuleForm/AddRuleForm";
import EditRuleForm from "../../RuleForm/EditRuleForm";
import styles from "./RuleModal.module.css";

const RuleModal = ({ currentProduct, formData, handleChange, handleSubmit, setIsRuleModalOpen, products, rules, setFormData, isEditing }) => {
    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={() => setIsRuleModalOpen(false)}>&times;</span>
                <h2>{isEditing ? `Edit Rule for ${currentProduct.product_name}` : "Add New Rule"}</h2>
                {isEditing ? (
                    <EditRuleForm
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        setFormData={setFormData}
                        products={products}
                        rules={rules}
                    />
                ) : (
                    <AddRuleForm
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        setFormData={setFormData}
                        products={products}
                        rules={rules}
                    />
                )}
            </div>
        </div>
    );
};

export default RuleModal;