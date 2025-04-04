import { useEffect, useRef, useCallback, useState } from "react";
import { fetchData, updateData, deleteData } from "../utils/apiUtils";
import { toast } from "react-toastify";

const useProductOperations = (initialValues, setFilteredProducts, setCategories, setEditingProduct) => {
    const productTableRef = useRef();
    const [formData, setFormData] = useState(initialValues || {});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value })); // Update formData on input change
    };

    const resetForm = (newValues) => {
        setFormData(newValues || {});
    };

    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetchData("/products");
            if (!Array.isArray(response)) {
                throw new Error("Expected an array but got: " + JSON.stringify(response));
            }
            setFilteredProducts(response);
            const uniqueCategories = [...new Set(response.map(product => product.category))];
            setCategories(uniqueCategories);
            toast.success("Products fetched successfully!");
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to fetch products. Please try again.");
        }
    }, [setFilteredProducts, setCategories]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        toast.info("Editing product...");
    };

    const handleUpdateProduct = async (updatedProduct) => {
        try {
            await updateData(`/products/${updatedProduct.product_id}`, updatedProduct);
            fetchProducts();
            setEditingProduct(null);
            toast.success("Product updated successfully!");
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Failed to update product. Please try again.");
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await deleteData(`/products/${productId}`);
            fetchProducts();
            toast.success("Product deleted successfully!");
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product. Please try again.");
        }
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        toast.info("Edit canceled.");
    };

    return {
        productTableRef,
        handleEditProduct,
        handleUpdateProduct,
        handleDeleteProduct,
        handleCancelEdit,
        fetchProducts,
        formData,
        handleChange,
        resetForm,
    };
};

export default useProductOperations;