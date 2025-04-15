import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import ProductTableControls from "./ProductTableControls/ProductTableControls";
import ProductTableRow from './ProductTableRow/ProductTableRow';
import ProductModal from "./ProductModal/ProductModal";
import AddProductForm from "./ProductForm/AddProductForm";
import EditProductForm from "./ProductForm/EditProductForm";
import ConfirmationModal from "../common/ConfirmationModal/ConfirmationModal";
import styles from "./ProductTable.module.css";
import { exportToPDF } from '../../utils/exportToPDF';
import useProductOperations from "../../hooks/useProductOperations";

const ProductTable = ({ 
    onToggleRuleList, 
    showRuleList, 
    openRuleModal // This is the openRuleModal function from App.js
}) => {
    const { 
        filteredProducts, 
        rules,
        setFilteredProducts,
        setCategories
    } = useAppContext();

    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false); // State for Add Product Modal
    const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false); // State for Edit Product Modal
    const [editingProduct, setEditingProduct] = useState(null); // State for the product being edited

    const { 
        handleEditProduct, 
        handleDeleteProduct,
        handleDeleteProductConfirmed,
        cancelDeleteProduct,
        showDeleteConfirmation,
        productToDelete
    } = useProductOperations(
        null, 
        setFilteredProducts,
        setCategories,
        setEditingProduct
    );

    const handleEditClick = (product) => {
        setEditingProduct(product); // Set the product to be edited
        setIsEditProductModalOpen(true); // Open the Edit Product Modal
    };

    // Find the product name for the deletion confirmation
    const getProductToDeleteName = () => {
        if (!productToDelete) return "";
        const product = filteredProducts.find(p => p.product_id === productToDelete);
        return product ? product.product_name : "";
    };

    return (
        <div className={styles.productTableContainer}>
            <ProductTableControls
                onExportToPDF={() => exportToPDF(filteredProducts)}
                onAddProductClick={() => setIsAddProductModalOpen(true)} // Open Add Product Modal
                onToggleRuleList={onToggleRuleList}
                showRuleList={showRuleList}
                products={filteredProducts}
                rules={rules}
            />
            <table className={styles.productTable}>
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Unit</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(filteredProducts) && filteredProducts.map((product) => (
                        <ProductTableRow
                            key={product.product_id}
                            product={product}
                            rules={rules}
                            onEditProduct={() => handleEditClick(product)} // Pass the product to handleEditClick
                            onDeleteProduct={handleDeleteProduct}
                            openRuleModal={() => openRuleModal(null, product)}
                        />
                    ))}
                </tbody>
            </table>
            {/* Add Product Modal */}
            {isAddProductModalOpen && (
                <ProductModal title="Add New Product" onClose={() => setIsAddProductModalOpen(false)}>
                    <AddProductForm onClose={() => setIsAddProductModalOpen(false)} />
                </ProductModal>
            )}
            {/* Edit Product Modal */}
            {isEditProductModalOpen && (
                <ProductModal title="Edit Product" onClose={() => setIsEditProductModalOpen(false)}>
                    <EditProductForm
                        product={editingProduct} // Pass the product being edited
                        onClose={() => setIsEditProductModalOpen(false)}
                        onUpdateProduct={handleEditProduct}
                    />
                </ProductModal>
            )}
            {/* Delete Confirmation Modal */}
            {showDeleteConfirmation && (
                <ConfirmationModal
                    title="Delete Product"
                    message={`Are you sure you want to delete "${getProductToDeleteName()}"? This action cannot be undone and will remove the product and its data from your inventory.`}
                    onConfirm={handleDeleteProductConfirmed}
                    onCancel={cancelDeleteProduct}
                    confirmButtonText="Delete Product"
                    cancelButtonText="Cancel"
                    confirmButtonVariant="danger"
                />
            )}
        </div>
    );
};

export default ProductTable;