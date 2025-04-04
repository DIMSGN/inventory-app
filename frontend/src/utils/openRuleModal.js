export const openRuleModal = (product, setCurrentProduct, setIsRuleModalOpen) => {
    console.log("openRuleModal called with product:", product);
    setCurrentProduct(product); // Set the product being used
    setIsRuleModalOpen(true);   // Open the modal
};