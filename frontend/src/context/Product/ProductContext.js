import React, { createContext } from "react";
import { useProductState } from "./ProductState";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const {
        products,
        filteredProducts,
        setFilteredProducts,
        categories,
        setCategories, 
        rules,
        editingProduct,
        setEditingProduct,
        fetchProducts, 
        handleFilterChange,
        handleUpdateProduct,
        handleDeleteProduct,
    } = useProductState(); 

    return (
        <ProductContext.Provider
            value={{
                products,
                filteredProducts,
                setFilteredProducts,
                categories,
                setCategories, 
                rules,
                editingProduct,
                setEditingProduct,
                fetchProducts, 
                handleFilterChange,
                handleUpdateProduct,
                handleDeleteProduct,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};