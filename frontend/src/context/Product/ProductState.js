import { useState, useEffect, useCallback } from "react";
import { fetchProducts, fetchRules, updateProduct, deleteProduct } from "./ProductActions";
import { handleFilterChange } from "./ProductFilters";
import axios from "axios";
import categoryService from "../../services/categoryService"; // Import categoryService
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

export const useProductState = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [rules, setRules] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedFilterOptions, setSelectedFilterOptions] = useState([]); // Track selected filter options

    // Fetch products and rules
    const fetchAllProducts = useCallback(async () => {
        try {
            const { products } = await fetchProducts(); // Remove categories destructuring
            setProducts(products);
            setFilteredProducts(products);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }, []);

    const fetchAllRules = useCallback(async () => {
        const rules = await fetchRules();
        setRules(rules);
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/categories`);
            console.log("Fetched categories:", response.data); // Debug log
            setCategories(response.data); // Update categories state
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleDeleteCategory = async (categoryName) => {
        if (!categoryName) {
            console.error("Category name is undefined"); // Debug log
            return;
        }

        console.log("Deleting category:", categoryName); // Debug log

        try {
            await categoryService.deleteCategory(categoryName); // Call the API to delete the category
            setCategories((prev) => prev.filter((category) => category.name !== categoryName)); // Remove the category from the state
            toast.success("Category deleted successfully!");
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Failed to delete category. Please try again.");
        }
    };

    // Reapply filtering whenever products or selectedFilterOptions change
    useEffect(() => {
        handleFilterChange(selectedFilterOptions, products, setFilteredProducts);
    }, [products, selectedFilterOptions]); // Dependencies: products and selectedFilterOptions

    useEffect(() => {
        fetchAllProducts();
        fetchAllRules();
        fetchCategories(); // Fetch categories on mount
    }, [fetchAllProducts, fetchAllRules]);

    return {
        products,
        filteredProducts,
        setFilteredProducts,
        categories,
        setCategories,
        rules,
        editingProduct,
        setEditingProduct,
        fetchProducts: fetchAllProducts, // Expose fetchAllProducts as fetchProducts
        handleFilterChange: (selectedOptions) => {
            setSelectedFilterOptions(selectedOptions); // Update selected filter options
            handleFilterChange(selectedOptions, products, setFilteredProducts);
        },
        handleUpdateProduct: (updatedProduct) => updateProduct(updatedProduct, fetchAllProducts, setEditingProduct),
        handleDeleteProduct: (productId) => deleteProduct(productId, fetchAllProducts),
        handleDeleteCategory, // Expose handleDeleteCategory
    };
};