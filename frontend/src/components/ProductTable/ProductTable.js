import React, { forwardRef, useState, useEffect } from "react";
import styles from "./ProductTable.module.css";
import RuleModal from "./RuleModal/RuleModal";
import ProductTableControls from "./ProductTableControls/ProductTableControls";
import ProductTableRow from "./ProductTableRow/ProductTableRow";
import useForm from "../../hooks/useForm";
import useFetch from "../../hooks/useFetch";
import exportOrderRequirements from "../../utils/exportOrderRequirements"; // Correct import
import { colors } from "../../utils/colors"; // Import colors from utils
import { exportToPDF } from "../../utils/exportToPDF";
import { handleSubmit } from "../../utils/handleSubmit";
import { openRuleModal } from "../../utils/openRuleModal";

const ProductTable = forwardRef(({ products, onEditProduct, onDeleteProduct, onAddProductClick, rules: initialRules, selectedCategories }, ref) => {
    const [rules, setRules] = useState(initialRules || []); // Ensure rules is initialized as an array
    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const { formData, handleChange, resetForm } = useForm({
        rules: "",
        comparison: "",
        amount: "",
        color: ""
    });

    const { data: fetchedRules, loading } = useFetch("https://app-d118d68a-4c2e-42ad-b162-dd8cc2db6692.cleverapps.io/api/rules");

    useEffect(() => {
        if (!loading && fetchedRules) {
            setRules(fetchedRules);
        }
    }, [fetchedRules, loading]);

    const filteredProducts = selectedCategories.length
        ? products.filter(product => selectedCategories.includes(product.category))
        : products;

    const handleExportOrders = () => {
        if (!Array.isArray(products)) {
            console.error("Expected an array of products");
            return;
        }
        exportOrderRequirements(products, rules);
    };

    return (
        <div className={styles.productTableContainer}>
            <h2 className={styles.title}>Product Table</h2> {/* Add title for Product Table */}
            <ProductTableControls
                exportToPDF={() => exportToPDF(products)}
                onAddProductClick={onAddProductClick}
                exportOrderRequirements={handleExportOrders} // Correct function call
                products={products}
                rules={rules}
            />
            <table ref={ref} className={styles.productTable}>
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product) => (
                        <ProductTableRow
                            key={product.product_id}
                            product={product}
                            rules={rules}
                            onEditProduct={onEditProduct}
                            onDeleteProduct={onDeleteProduct}
                            openRuleModal={(product) => openRuleModal(product, setCurrentProduct, resetForm, handleChange, setIsRuleModalOpen)}
                        />
                    ))}
                </tbody>
            </table>
            {isRuleModalOpen && (
                <RuleModal
                    currentProduct={currentProduct}
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={(e) => handleSubmit(e, formData, currentProduct, setIsRuleModalOpen, resetForm)}
                    colors={colors} // Use imported colors
                    setIsRuleModalOpen={setIsRuleModalOpen}
                />
            )}
        </div>
    );
});

export default ProductTable;