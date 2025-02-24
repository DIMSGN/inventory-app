import React from "react";
import exportOrderRequirements from "../../utils/exportOrderRequirements";

const ProductTableControls = ({ products, rules }) => {
    const handleExportOrders = () => {
        if (!Array.isArray(products)) {
            console.error("Expected an array of products");
            return;
        }
        exportOrderRequirements(products, rules);
    };

    return (
        <div>
            <button onClick={handleExportOrders}>Export Orders</button>
        </div>
    );
};

export default ProductTableControls;