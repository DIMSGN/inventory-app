import { useEffect, useRef, useCallback } from "react";
import { fetchData, updateData, deleteData } from "../../utils/apiUtils";

const ProductOperations = ({ setProducts, setFilteredProducts, setCategories, setEditingProduct }) => {
    const productTableRef = useRef();

    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetchData("/api/products");
            console.log("API Response:", response); // Add this line to log the response
            if (!Array.isArray(response)) {
                throw new Error("Expected an array of products");
            }
            setProducts(response); // Update the state of the product list
            setFilteredProducts(response); // Update the state of the filtered product list
            const uniqueCategories = [...new Set(response.map(product => product.category))]; // Extract unique categories
            setCategories(uniqueCategories); // Update the state of the categories
        } catch (error) {
            console.error("Error fetching products:", error);
            alert(`Failed to fetch products: ${error.response?.data?.error || error.message}`);
        }
    }, [setProducts, setFilteredProducts, setCategories]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleFilterChange = (filter) => {
        setFilteredProducts(products => {
            if (filter) {
                return products.filter(product => product.category === filter);
            } else {
                return products;
            }
        });
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
    };

    const handleUpdateProduct = async (updatedProduct) => {
        try {
            await updateData(`/api/products/${updatedProduct.product_id}`, updatedProduct);
            fetchProducts(); // Refresh the product list
            setEditingProduct(null); // Clear the currently editing product
        } catch (error) {
            console.error("Error updating product:", error);
            alert(`Failed to update product: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await deleteData(`/api/products/${productId}`);
            fetchProducts(); // Refresh the product list
        } catch (error) {
            console.error("Error deleting product:", error);
            alert(`Failed to delete product: ${error.response?.data?.error || error.message}`);
        }
    };

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
        fetchProducts,
    };
};

export default ProductOperations;