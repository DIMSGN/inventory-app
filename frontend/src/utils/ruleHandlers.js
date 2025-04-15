import { ruleService } from "../services/apiServices";

export const handleAddRule = async (rule, setRules, closeModal) => {
    console.log("Data being sent to backend:", rule); // Debugging log
    try {
        const response = await ruleService.addRule(rule);
        console.log("Rule added successfully:", response.data); // Debugging log
        setRules((prevRules) => [...prevRules, response.data]);
        closeModal(); // Close the modal after successful addition
    } catch (error) {
        console.error("Error adding rule:", error.response?.data || error.message);
        throw error;
    }
};

export const handleEditRule = (rule, setCurrentRule, setShowForm) => {
    setCurrentRule(rule);
    setShowForm(true); // Show form when editing rule
};

export const handleUpdateRule = async (updatedRule, setRules, setCurrentRule, setShowForm) => {
    try {
        await ruleService.updateRule(updatedRule.id, updatedRule);
        setRules(prevRules => prevRules.map(r => (r.id === updatedRule.id ? updatedRule : r)));
        setCurrentRule(null);
        setShowForm(false); // Hide form after updating rule
    } catch (error) {
        console.error("Error updating rule:", error);
    }
};

export const handleDeleteRule = async (id, setRules) => {
    try {
        await ruleService.deleteRule(id);
        setRules(prevRules => prevRules.filter(r => r.id !== id));
    } catch (error) {
        console.error("Error deleting rule:", error);
    }
};

export const handleColorChange = (selectedOption, setCurrentRule) => {
    setCurrentRule(prevRule => ({
        ...prevRule,
        color: selectedOption.value
    }));
};

export const validateProductName = (name, products) => {
    return products.some(product => product.product_name === name);
};