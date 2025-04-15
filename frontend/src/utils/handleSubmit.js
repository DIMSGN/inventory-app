import { ruleService } from "../services/apiServices";

export const handleSubmit = async (e, formData, currentProduct, setIsRuleModalOpen, resetForm) => {
    e.preventDefault();
    console.log("Submitting rule:", { ...formData, product_id: currentProduct.product_id }); // Debugging log
    try {
        const response = await ruleService.addRule({ ...formData, product_id: currentProduct.product_id });
        console.log("Rule added successfully:", response.data); // Debugging log
        setIsRuleModalOpen(false);
        resetForm();
    } catch (error) {
        console.error("Error adding rule:", error.response?.data || error.message);
    }
};