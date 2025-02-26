import { useEffect, useRef, useCallback } from "react";
import { fetchData, updateData, deleteData } from "../../utils/apiUtils";

const ProductOperations = ({ setProducts, setFilteredProducts, setCategories, setEditingProduct }) => {
    const productTableRef = useRef();

    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetchData("/api/products");
            console.log("API Response:", response);
            if (!Array.isArray(response)) {
                throw new Error("Expected an array of products");
            }
            setProducts(response);
            setFilteredProducts(response);
            const uniqueCategories = [...new Set(response.map(product => product.category))];
            setCategories(uniqueCategories);
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
            fetchProducts();
            setEditingProduct(null);
        } catch (error) {
            console.error("Error updating product:", error);
            alert(`Failed to update product: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await deleteData(`/api/products/${productId}`);
            fetchProducts();
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