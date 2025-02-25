export const openRuleModal = (product, setCurrentProduct, resetForm, handleChange, setIsRuleModalOpen) => {
    setCurrentProduct(product);
    resetForm();
    handleChange({ target: { name: "rules", value: product.product_name } }); // Set the rules input to the product name
    setIsRuleModalOpen(true);
};