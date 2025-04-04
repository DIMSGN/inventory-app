import { fetchData, updateData, deleteData } from "../../utils/apiUtils";

export const fetchProducts = async () => {
    try {
        const response = await fetchData("/products");
        const uniqueCategories = [...new Set(response.map(product => product.category))];
        return { products: response, categories: uniqueCategories };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { products: [], categories: [] };
    }
};

export const fetchRules = async () => {
    try {
        return await fetchData("/rules");
    } catch (error) {
        console.error("Error fetching rules:", error);
        return [];
    }
};

export const updateProduct = async (updatedProduct, fetchProducts, setEditingProduct) => {
    try {
        await updateData(`/products/${updatedProduct.product_id}`, updatedProduct);
        fetchProducts(); // Refresh the product list
        setEditingProduct(null); // Clear the editing state
    } catch (error) {
        console.error("Error updating product:", error);
    }
};

export const deleteProduct = async (productId, fetchProducts) => {
    try {
        await deleteData(`/products/${productId}`);
        fetchProducts(); // Refresh the product list
    } catch (error) {
        console.error("Error deleting product:", error);
    }
};