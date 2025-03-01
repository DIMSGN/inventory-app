import ruleService from "../services/ruleService";

export const handleAddRule = async (rule, setRules, setShowForm) => {
    try {
        const newRule = await ruleService.addRule(rule);
        setRules(prevRules => [...prevRules, newRule]);
        setShowForm(false); // Hide form after adding rule
    } catch (error) {
        console.error("Error adding rule:", error);
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