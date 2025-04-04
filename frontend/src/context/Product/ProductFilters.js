export const handleFilterChange = (selectedOptions, products, setFilteredProducts) => {
    if (!selectedOptions || selectedOptions.length === 0) {
        setFilteredProducts(products); // Reset to all products if no filter is selected
    } else {
        const selectedCategories = selectedOptions.map(option => option.value);
        const filtered = products.filter(product => selectedCategories.includes(product.category));
        setFilteredProducts(filtered); // Update filtered products based on selected categories
    }
};