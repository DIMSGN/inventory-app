import ruleService from "../services/ruleService";

export const handleSubmit = async (e, formData, currentProduct, setIsRuleModalOpen, resetForm) => {
    e.preventDefault();
    try {
        await ruleService.addRule({ ...formData, product_id: currentProduct.product_id });
        setIsRuleModalOpen(false);
        resetForm();
    } catch (error) {
        console.error("Error adding rule:", error);
    }
};