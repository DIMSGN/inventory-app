import { useState, useEffect, useRef, useCallback } from "react";
import { fetchData, updateData, deleteData } from "../utils/apiUtils"; // Ensure correct import paths

/**
 * Custom hook to handle form state, changes, and product operations.
 * @param {Object} initialValues - The initial values for the form.
 * @param {Function} setFilteredProducts - Function to set filtered products.
 * @param {Function} setCategories - Function to set categories.
 * @param {Function} setEditingProduct - Function to set the editing product.
 * @returns {Object} - The form state, handleChange function, resetForm function, and product operations.
 */
const useProductOperations = (initialValues, setFilteredProducts, setCategories, setEditingProduct) => {
    const [formData, setFormData] = useState(initialValues);
    const productTableRef = useRef();
    const [products, setProducts] = useState([]); // Initialize state as an empty array

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const resetForm = () => {
        setFormData(initialValues);
    };

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
    }, [setFilteredProducts, setCategories]);

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
        formData,
        handleChange,
        resetForm,
        productTableRef,
        handleFilterChange,
        handleEditProduct,
        handleUpdateProduct,
        handleDeleteProduct,
        handleCancelEdit,
        fetchProducts,
    };
};

export default useProductOperations;