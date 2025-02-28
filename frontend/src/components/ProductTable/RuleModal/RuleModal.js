import React from "react";
import RuleForm from "../../RuleForm/RuleForm"; // Import RuleForm
import styles from "./RuleModal.module.css";

const RuleModal = ({ currentProduct, formData, handleChange, handleSubmit, setIsRuleModalOpen }) => {
    const handleColorChange = (selectedOption) => {
        handleChange({ target: { name: "color", value: selectedOption.value } });
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Add Rule for {currentProduct.product_name}</h2>
                <RuleForm
                    formData={{ ...formData, product_id: currentProduct.product_id }} // Ensure product_id is included
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    setFormData={null} // No need to clear form data in modal
                    setEditingRule={null} // No need to handle editing rule in modal
                    productName={currentProduct.product_name} // Pass the product name
                    handleColorChange={handleColorChange} // Pass the handleColorChange function
                />
                <button type="button" onClick={() => setIsRuleModalOpen(false)}>Cancel</button>
            </div>
        </div>
    );
};

export default React.memo(RuleModal);