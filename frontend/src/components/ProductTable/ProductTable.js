import React, { useEffect, useState } from "react";
import ProductTableControls from "./ProductTableControls/ProductTableControls";
import RuleModal from "./RuleModal/RuleModal";
import useFetch from "../../hooks/useFetch";
import ProductTableRow from "./ProductTableRow/ProductTableRow"; // Ensure this import
import styles from "./ProductTable.module.css";
import exportOrderRequirements from "../../utils/exportOrderRequirements";
import { exportToPDF } from "../../utils/exportToPDF";

const ProductTable = ({ onAddProductClick, exportToPDF, onEditProduct, onDeleteProduct, exportOrderRequirements }) => {
    const { data: products, loading } = useFetch("/products");
    const { data: rules, loading: rulesLoading } = useFetch("/rules");
    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const handleOpenRuleModal = (product) => {
        setCurrentProduct(product);
        setIsRuleModalOpen(true);
    };

    console.log("Products Data:", products);
    console.log("Rules Data:", rules);

    if (loading || rulesLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.productTableContainer}>
            <h2 className={styles.title}>Product Table</h2>
            <ProductTableControls
                exportToPDF={() => exportToPDF(products)}
                onAddProductClick={onAddProductClick}
                exportOrderRequirements={() => exportOrderRequirements(products, rules)}
            />
            <table className={styles.productTable}>
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Unit</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <ProductTableRow
                            key={product.product_id}
                            product={product}
                            rules={rules}
                            onEditProduct={onEditProduct}
                            onDeleteProduct={onDeleteProduct}
                            openRuleModal={handleOpenRuleModal}
                        />
                    ))}
                </tbody>
            </table>
            {isRuleModalOpen && (
                <RuleModal
                    currentProduct={currentProduct}
                    formData={{}} // Pass the appropriate formData
                    handleChange={() => {}} // Pass the appropriate handleChange function
                    handleSubmit={() => {}} // Pass the appropriate handleSubmit function
                    colors={[]} // Pass the appropriate colors array
                    setIsRuleModalOpen={setIsRuleModalOpen}
                />
            )}
        </div>
    );
};

export default ProductTable;