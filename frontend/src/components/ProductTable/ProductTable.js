import React, { useContext, useState } from "react";
import { ProductContext } from "../../context/ProductContext";
import ProductTableControls from "./ProductTableControls/ProductTableControls";
import ProductTableRow from "./ProductTableRow/ProductTableRow";
import { openRuleModal } from "../../utils/openRuleModal";
import styles from "./ProductTable.module.css";
import exportOrderRequirements from "../../utils/exportOrderRequirements";
import { exportToPDF } from "../../utils/exportToPDF";
import RuleModal from "./RuleModal/RuleModal";
import useProductOperations from "../../hooks/useProductOperations"; // Import useProductOperations

const ProductTable = ({ onAddProductClick, onToggleRuleList, showRuleList, setShowForm, setCurrentRule, setEditingProduct }) => {
    const { filteredProducts, rules, setRules, setFilteredProducts, setCategories } = useContext(ProductContext);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        rules: "",
        comparison: "=",
        amount: "",
        color: ""
    });

    const resetForm = () => {
        setFormData({
            rules: "",
            comparison: "=",
            amount: "",
            color: ""
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleAddRule = async (newRule, setRules, setShowForm) => {
        try {
            const response = await fetch("/api/rules", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newRule)
            });
            if (!response.ok) {
                throw new Error("Failed to add rule");
            }
            const addedRule = await response.json();
            setRules((prevRules) => [...prevRules, addedRule]);
            setShowForm(false);
        } catch (error) {
            console.error("Error adding rule:", error);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting form data:", formData);
        try {
            await handleAddRule({ ...formData, product_id: currentProduct.product_id }, setRules, setShowForm);
            setIsRuleModalOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error adding rule:", error);
        }
    };

    const { handleFilterChange, handleEditProduct, handleUpdateProduct, handleDeleteProduct, handleCancelEdit } = useProductOperations(
        {},
        setFilteredProducts,
        setCategories,
        setEditingProduct
    );

    return (
        <div className={styles.productTableContainer}>
            <h2 className={styles.title}>Product Table</h2>
            <ProductTableControls
                exportToPDF={() => exportToPDF(filteredProducts)}
                exportOrderRequirements={() => exportOrderRequirements(filteredProducts, rules)}
                onAddProductClick={onAddProductClick}
                onToggleRuleList={onToggleRuleList}
                showRuleList={showRuleList}
            />
            <table className={styles.productTable}>
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Unit</th>
                        <th>Rules</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(filteredProducts) && filteredProducts.map((product) => (
                        <ProductTableRow
                            key={product.product_id}
                            product={product}
                            rules={rules}
                            onEditProduct={handleEditProduct} 
                            onDeleteProduct={handleDeleteProduct}
                            openRuleModal={() => openRuleModal(product, setCurrentProduct, resetForm, handleChange, setIsRuleModalOpen)}
                        />
                    ))}
                </tbody>
            </table>
            {isRuleModalOpen && (
                <RuleModal
                    currentProduct={currentProduct}
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleFormSubmit}
                    setIsRuleModalOpen={setIsRuleModalOpen}
                    products={filteredProducts}
                    rules={rules}
                />
            )}
        </div>
    );
};

export default ProductTable;