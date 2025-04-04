import React, { useContext, useState } from "react";
import { ProductContext } from "../../context/Product/ProductContext";
import ProductTableControls from "./ProductTableControls/ProductTableControls";
import ProductTableRow from "./ProductTableRow/ProductTableRow";
import ProductModal from "./ProductModal/ProductModal"; // Import ProductModal
import AddProductForm from "./ProductForm/AddProductForm"; // Import AddProductForm
import EditProductForm from "./ProductForm/EditProductForm"; // Import EditProductForm
import { openRuleModal } from "../../utils/openRuleModal";
import styles from "./ProductTable.module.css";
import exportOrderRequirements from "../../utils/exportOrderRequirements";
import { exportToPDF } from "../../utils/exportToPDF";
import RuleModal from "./RuleModal/RuleModal";
import useProductOperations from "../../hooks/useProductOperations";
import { toast } from "react-toastify";

const ProductTable = ({ onAddProductClick, onToggleRuleList, showRuleList, setShowForm, setCurrentRule }) => {
    const { filteredProducts, rules, setRules, setFilteredProducts, setCategories } = useContext(ProductContext);

    const [currentProduct, setCurrentProduct] = useState(null);
    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false); // State for Add Product Modal
    const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false); // State for Edit Product Modal
    const [editingProduct, setEditingProduct] = useState(null); // State for the product being edited
    const [formData, setFormData] = useState({
        rules: "",
        comparison: "=",
        amount: "",
        color: ""
    });
    const [isEditing, setIsEditing] = useState(false);

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
            toast.success("Rule added successfully!");
        } catch (error) {
            console.error("Error adding rule:", error);
            toast.error("Failed to add rule. Please try again.");
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!currentProduct || !currentProduct.product_id) {
            toast.error("No valid product selected.");
            return;
        }

        try {
            await handleAddRule({ ...formData, product_id: currentProduct.product_id }, setRules, setShowForm);
            setIsRuleModalOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error adding rule:", error);
        }
    };

    const { handleEditProduct, handleDeleteProduct } = useProductOperations(
        {}, // Provide initialValues (empty object or default structure)
        setFilteredProducts,
        setCategories,
        setEditingProduct
    );

    const handleEditClick = (product) => {
        setEditingProduct(product); // Set the product to be edited
        setIsEditProductModalOpen(true); // Open the Edit Product Modal
    };

    return (
        <div className={styles.productTableContainer}>
            <ProductTableControls
                exportToPDF={() => exportToPDF(filteredProducts)}
                exportOrderRequirements={() => exportOrderRequirements(filteredProducts, rules)}
                onAddProductClick={() => setIsAddProductModalOpen(true)} // Open Add Product Modal
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
                            onEditProduct={() => handleEditClick(product)} // Pass the product to handleEditClick
                            onDeleteProduct={handleDeleteProduct}
                            openRuleModal={(product) => openRuleModal(product, setCurrentProduct, setIsRuleModalOpen)}
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
                    setFormData={setFormData}
                    isEditing={isEditing}
                />
            )}
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
        </div>
    );
};

export default ProductTable;