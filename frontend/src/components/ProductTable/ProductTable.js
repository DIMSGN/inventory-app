import React, { useEffect, useState } from "react";
import ProductTableControls from "./ProductTableControls/ProductTableControls";
import RuleModal from "./RuleModal/RuleModal";
import useFetch from "../../hooks/useFetch";
import styles from "./ProductTable.module.css";

const ProductTable = ({ onAddProductClick, exportToPDF, onEditProduct, onDeleteProduct, exportOrderRequirements }) => {
    const { data: products, loading } = useFetch("/products");
    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const handleOpenRuleModal = (product) => {
        setCurrentProduct(product);
        setIsRuleModalOpen(true);
    };

    console.log("Products Data:", products);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.productTableContainer}>
            <h2 className={styles.title}>Product Table</h2>
            <ProductTableControls
                exportToPDF={() => exportToPDF(products)}
                onAddProductClick={onAddProductClick}
                exportOrderRequirements={() => exportOrderRequirements(products)}
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
                        <tr key={product.product_id}>
                            <td>{product.product_id}</td>
                            <td>{product.product_name}</td>
                            <td>{product.category}</td>
                            <td>{product.unit}</td>
                            <td>{product.amount}</td>
                            <td>
                                <button onClick={() => onEditProduct(product)}>Edit</button>
                                <button onClick={() => onDeleteProduct(product.product_id)}>Delete</button>
                                <button onClick={() => handleOpenRuleModal(product)}>Add Rule</button>
                            </td>
                        </tr>
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