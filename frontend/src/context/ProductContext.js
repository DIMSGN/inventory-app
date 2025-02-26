import React, { createContext, useState, useEffect, useCallback } from "react";
import { fetchData, updateData, deleteData } from "../utils/apiUtils";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [rules, setRules] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetchData("/products");
            setProducts(response);
            setFilteredProducts(response);
            const uniqueCategories = [...new Set(response.map(product => product.category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }, []);

    const fetchRules = useCallback(async () => {
        try {
            const response = await fetchData("/rules");
            setRules(response);
        } catch (error) {
            console.error("Error fetching rules:", error);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
        fetchRules();
    }, [fetchProducts, fetchRules]);

    const handleFilterChange = (selectedOptions) => {
        if (!selectedOptions || selectedOptions.length === 0) {
            setFilteredProducts(products);
        } else {
            const selectedCategories = selectedOptions.map(option => option.value);
            const filtered = products.filter(product => selectedCategories.includes(product.category));
            setFilteredProducts(filtered);
        }
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

    return (
        <ProductContext.Provider
            value={{
                products,
                filteredProducts,
                categories,
                rules,
                editingProduct,
                handleFilterChange,
                handleEditProduct,
                handleUpdateProduct,
                handleDeleteProduct,
                setEditingProduct,
                fetchProducts,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};