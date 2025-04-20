import React, { useState } from "react";
import { useAppContext } from '../../../../common/contexts/AppContext';
import ProductTableControls from "./ProductTableControls/ProductTableControls";
import ProductTableRow from './ProductTableRow/ProductTableRow';
import ProductModal from "./ProductModal/ProductModal";
import AddProductForm from "./ProductForm/AddProductForm";
import EditProductForm from "./ProductForm/EditProductForm";
import ConfirmationModal from "../../../../common/components/ConfirmationModal";
import { Link } from "react-router-dom";
import styles from "./ProductTable.module.css";
import { exportToPDF } from '../../utils/exportToPDF';
import moment from 'moment';

const ProductTable = () => {
    const { 
        filteredProducts, 
        rules,
        getRuleColor,
        setEditingProduct,
        deleteProduct,
        editingProduct
    } = useAppContext();

    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [showExpiredOnly, setShowExpiredOnly] = useState(false);
    const [showExpiringProducts, setShowExpiringProducts] = useState(false);
    
    // Filter products based on expiration
    const getFilteredProducts = () => {
        let displayProducts = [...filteredProducts];
        const today = moment().startOf('day');
        const oneWeekFromNow = moment().add(7, 'days').startOf('day');
        
        if (showExpiredOnly) {
            displayProducts = displayProducts.filter(product => 
                product.expiration_date && moment(product.expiration_date).isBefore(today)
            );
        } else if (showExpiringProducts) {
            displayProducts = displayProducts.filter(product => 
                product.expiration_date && 
                moment(product.expiration_date).isAfter(today) && 
                moment(product.expiration_date).isBefore(oneWeekFromNow)
            );
        }
        
        return displayProducts;
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setIsEditProductModalOpen(true);
    };

    const handleDeleteClick = (productId) => {
        setProductToDelete(productId);
        setShowDeleteConfirmation(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            await deleteProduct(productToDelete);
            setShowDeleteConfirmation(false);
            setProductToDelete(null);
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirmation(false);
        setProductToDelete(null);
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
                onAddProductClick={() => setIsAddProductModalOpen(true)}
                products={filteredProducts}
                rules={rules}
                showExpiredOnly={showExpiredOnly}
                setShowExpiredOnly={setShowExpiredOnly}
                showExpiringProducts={showExpiringProducts}
                setShowExpiringProducts={setShowExpiringProducts}
            />
            <table className={styles.productTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Price</th>
                        <th>Purchase Price</th>
                        <th>Unit Price</th>
                        <th>Received Date</th>
                        <th>Expiration</th>
                        <th className={styles.centered}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {getFilteredProducts().map((product) => {
                        const ruleColor = getRuleColor(product);
                        const isExpired = product.expiration_date && moment(product.expiration_date).isBefore(moment().startOf('day'));
                        const isExpiring = product.expiration_date && 
                            moment(product.expiration_date).isAfter(moment().startOf('day')) && 
                            moment(product.expiration_date).isBefore(moment().add(7, 'days').startOf('day'));
                        
                        return (
                            <ProductTableRow
                                key={product.product_id}
                                product={product}
                                ruleColor={ruleColor}
                                isExpired={isExpired}
                                isExpiring={isExpiring}
                                onEditProduct={() => handleEditClick(product)}
                                onDeleteProduct={() => handleDeleteClick(product.product_id)}
                            />
                        );
                    })}
                </tbody>
            </table>
            
            {/* Add Product Modal */}
            {isAddProductModalOpen && (
                <ProductModal title="Add New Product" onClose={() => setIsAddProductModalOpen(false)}>
                    <AddProductForm onClose={() => setIsAddProductModalOpen(false)} />
                </ProductModal>
            )}
            
            {/* Edit Product Modal */}
            {isEditProductModalOpen && editingProduct && (
                <ProductModal title="Edit Product" onClose={() => setIsEditProductModalOpen(false)}>
                    <EditProductForm
                        product={editingProduct}
                        onClose={() => setIsEditProductModalOpen(false)}
                    />
                </ProductModal>
            )}
            
            {/* Delete Confirmation Modal */}
            {showDeleteConfirmation && (
                <ConfirmationModal
                    title="Delete Product"
                    message={`Are you sure you want to delete "${getProductToDeleteName()}"? This action cannot be undone.`}
                    onConfirm={handleDeleteConfirmed}
                    onCancel={cancelDelete}
                    confirmButtonText="Delete Product"
                    cancelButtonText="Cancel"
                    confirmButtonVariant="danger"
                />
            )}
        </div>
    );
};

export default ProductTable;