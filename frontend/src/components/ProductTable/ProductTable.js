import React, { useEffect, useState } from "react";
import ProductTableControls from "./ProductTableControls/ProductTableControls";
import useFetch from "../../hooks/useFetch";
import styles from "./ProductTable.module.css";

const ProductTable = ({ products, onAddProductClick, exportToPDF }) => {
    const [rules, setRules] = useState([]);
    const { data: fetchedRules, loading } = useFetch("/api/rules");

    useEffect(() => {
        if (!loading && fetchedRules) {
            setRules(fetchedRules);
        }
    }, [fetchedRules, loading]);

    const handleExportOrders = () => {
        if (!Array.isArray(products)) {
            console.error("Expected an array of products");
            return;
        }
        exportOrderRequirements(products, rules);
    };

    console.log("Products Data:", products); // Log the products data

    return (
        <div className={styles.productTableContainer}>
            <h2 className={styles.title}>Product Table</h2>
            <ProductTableControls
                exportToPDF={() => exportToPDF(products)}
                onAddProductClick={onAddProductClick}
                exportOrderRequirements={handleExportOrders}
            />
            <table className={styles.productTable}>
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
                    {Array.isArray(products) ? products.map((product) => (
                        <tr key={product.product_id}>
                            <td>{product.product_id}</td>
                            <td>{product.product_name}</td>
                            <td>{product.category}</td>
                            <td>{product.price}</td>
                            <td>{product.quantity}</td>
                            <td>
                                <button onClick={() => onEditProduct(product)}>Edit</button>
                                <button onClick={() => onDeleteProduct(product.product_id)}>Delete</button>
                            </td>
                        </tr>
                    )) : <tr><td colSpan="6">No products found</td></tr>}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;