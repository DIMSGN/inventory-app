import React, { useContext, useState } from "react";
import { ProductContext } from "../../context/ProductContext";
import ProductTableControls from "./ProductTableControls/ProductTableControls";
import ProductTableRow from "./ProductTableRow/ProductTableRow";
import { openRuleModal } from "../../utils/openRuleModal"; // Import openRuleModal
import ruleService from "../../services/ruleService"; // Import ruleService
import styles from "./ProductTable.module.css";
import exportOrderRequirements from "../../utils/exportOrderRequirements";
import { exportToPDF } from "../../utils/exportToPDF";
import RuleModal from "./RuleModal/RuleModal"; // Import RuleModal

const ProductTable = ({ onAddProductClick }) => {
    const { filteredProducts, rules, handleEditProduct, handleDeleteProduct } = useContext(ProductContext);
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

    const handleColorChange = (selectedOption) => {
        setFormData((prevData) => ({ ...prevData, color: selectedOption.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await ruleService.addRule({ ...formData, product_id: currentProduct.product_id });
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
                onAddProductClick={onAddProductClick} // Pass the onAddProductClick prop
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
                            openRuleModal={() => openRuleModal(product, setCurrentProduct, resetForm, handleChange, setIsRuleModalOpen)} // Use openRuleModal
                        />
                    ))}
                </tbody>
            </table>
            {isRuleModalOpen && (
                <RuleModal
                    currentProduct={currentProduct}
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    setIsRuleModalOpen={setIsRuleModalOpen}
                />
            )}
        </div>
    );
};

export default ProductTable;