// Import necessary modules and components
import { useEffect, useRef, useCallback } from "react";
import { fetchData, updateData, deleteData } from "../../utils/apiUtils";

/**
 * ProductOperations Component
 * This component provides various operations related to products, such as fetching, filtering, editing, updating, and deleting products.
 * It also manages the state of the product list, filtered products, categories, and the currently editing product.
 * 
 * Props:
 * - setProducts: Function to update the state of the product list.
 * - setFilteredProducts: Function to update the state of the filtered product list.
 * - setCategories: Function to update the state of the categories.
 * - setEditingProduct: Function to update the state of the currently editing product.
 */
const ProductOperations = ({ setProducts, setFilteredProducts, setCategories, setEditingProduct }) => {
    // Reference to the product table element
    const productTableRef = useRef();

    /**
     * Fetch all products from the server
     * This function sends a GET request to fetch all products and updates the state of the product list, filtered products, and categories.
     */
    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetchData("https://app-d118d68a-4c2e-42ad-b162-dd8cc2db6692.cleverapps.io/api/products");
            console.log("API Response:", response); // Add this line to log the response
            setProducts(response); // Update the state of the product list
            setFilteredProducts(response); // Update the state of the filtered product list
            const uniqueCategories = [...new Set(response.map(product => product.category))]; // Extract unique categories
            setCategories(uniqueCategories); // Update the state of the categories
        } catch (error) {
            console.error("Error fetching products:", error);
            alert(`Failed to fetch products: ${error.response?.data?.error || error.message}`);
        }
    }, [setProducts, setFilteredProducts, setCategories]);

    // Fetch products when the component mounts
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    /**
     * Handle filter change event
     * This function filters the product list based on the selected category and updates the state of the filtered product list.
     * @param {string} filter - The selected category to filter products by.
     */
    const handleFilterChange = (filter) => {
        setFilteredProducts(products => {
            if (filter) {
                return products.filter(product => product.category === filter);
            } else {
                return products;
            }
        });
    };

    /**
     * Handle edit product event
     * This function sets the currently editing product to the selected product.
     * @param {Object} product - The product to be edited.
     */
    const handleEditProduct = (product) => {
        setEditingProduct(product);
    };

    /**
     * Handle update product event
     * This function sends a PUT request to update the product details and refreshes the product list.
     * @param {Object} updatedProduct - The updated product details.
     */
    const handleUpdateProduct = async (updatedProduct) => {
        try {
            await updateData(`https://app-d118d68a-4c2e-42ad-b162-dd8cc2db6692.cleverapps.io/api/products/${updatedProduct.product_id}`, updatedProduct);
            fetchProducts(); // Refresh the product list
            setEditingProduct(null); // Clear the currently editing product
        } catch (error) {
            console.error("Error updating product:", error);
            alert(`Failed to update product: ${error.response?.data?.error || error.message}`);
        }
    };

    /**
     * Handle delete product event
     * This function sends a DELETE request to delete the product and refreshes the product list.
     * @param {number} productId - The ID of the product to be deleted.
     */
    const handleDeleteProduct = async (productId) => {
        try {
            await deleteData(`https://app-d118d68a-4c2e-42ad-b162-dd8cc2db6692.cleverapps.io/api/products/${productId}`);
            fetchProducts(); // Refresh the product list
        } catch (error) {
            console.error("Error deleting product:", error);
            alert(`Failed to delete product: ${error.response?.data?.error || error.message}`);
        }
    };

    /**
     * Handle cancel edit event
     * This function clears the currently editing product.
     */
    const handleCancelEdit = () => {
        setEditingProduct(null);
    };

    return {
        productTableRef,
        handleFilterChange,
        handleEditProduct,
        handleUpdateProduct,
        handleDeleteProduct,
        handleCancelEdit,
        fetchProducts, // Ensure fetchProducts is returned
    };
};

export default ProductOperations;