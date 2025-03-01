import React, { useContext, useState } from "react";
import { ProductContext } from "../../context/ProductContext";
import ProductTableControls from "./ProductTableControls/ProductTableControls";
import ProductTableRow from "./ProductTableRow/ProductTableRow";
import { openRuleModal } from "../../utils/openRuleModal";
import styles from "./ProductTable.module.css";
import exportOrderRequirements from "../../utils/exportOrderRequirements";
import { exportToPDF } from "../../utils/exportToPDF";
import RuleModal from "./RuleModal/RuleModal";
import {
    handleAddRule,
    handleEditRule,
    handleUpdateRule,
    handleDeleteRule,
    handleColorChange,
    validateProductName
} from "../../utils/ruleHandlers";

const ProductTable = ({ onAddProductClick, onToggleRuleList, showRuleList }) => {
    const { filteredProducts, rules, handleEditProduct, handleDeleteProduct, setRules } = useContext(ProductContext);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        rules: "",
        comparison: "=",
        amount: "",
        color: ""
    });
    const [currentRule, setCurrentRule] = useState(null);
    const [showForm, setShowForm] = useState(false);

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

    return (
        <div className={styles.productTableContainer}>
            <h2 className={styles.title}>Product Table</h2>
            <ProductTableControls
                exportToPDF={() => exportToPDF(filteredProducts)}
                exportOrderRequirements={() => exportOrderRequirements(filteredProducts, rules)}
                onAddProductClick={onAddProductClick}
                onToggleRuleList={onToggleRuleList} // Pass the handler to ProductTableControls
                showRuleList={showRuleList} // Pass the state to ProductTableControls
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
                />
            )}
        </div>
    );
};

export default ProductTable;