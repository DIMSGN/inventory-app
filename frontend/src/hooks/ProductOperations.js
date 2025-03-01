import { useEffect, useRef, useCallback, useState } from "react";
import { fetchData, updateData, deleteData } from "../utils/apiUtils"; // Updated path

const ProductOperations = ({ setFilteredProducts, setCategories, setEditingProduct }) => {
    const productTableRef = useRef();
    const [products, setProducts] = useState([]); // Initialize state as an empty array

    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetchData("/products");
            if (!Array.isArray(response)) {
                throw new Error("Expected an array but got: " + JSON.stringify(response));
            }
            setProducts(response);
            setFilteredProducts(response);
            const uniqueCategories = [...new Set(response.map(product => product.category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error("Error fetching products:", error);
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
            await updateData(`/products/${updatedProduct.product_id}`, updatedProduct);
            fetchProducts();
            setEditingProduct(null);
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await deleteData(`/products/${productId}`);
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
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