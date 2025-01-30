import React, { forwardRef, useState, useEffect } from "react";
import styles from "./ProductTable.module.css";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import RuleForm from "../RuleForm/RuleForm";
import CustomDropdown from "../common/CustomDropdown/CustomDropdown"; // Import CustomDropdown
import axios from "axios"; // Import axios for API calls

/**
 * ProductTable Component
 * This component renders a table of products with options to edit, delete, and export the table to PDF.
 * It also applies color rules to the rows based on product amounts.
 * 
 * Props:
 * - products: An array of product objects to display in the table.
 * - onEditProduct: Function to call when the edit button is clicked for a product.
 * - onDeleteProduct: Function to call when the delete button is clicked for a product.
 * - onAddProductClick: Function to call when the "Add Product" button is clicked.
 * - rules: An array of rule objects to apply color rules to the product rows.
 * - selectedCategories: An array of selected categories to filter products.
 */
const ProductTable = forwardRef(({ products, onEditProduct, onDeleteProduct, onAddProductClick, rules: initialRules, selectedCategories }, ref) => {
    const [rules, setRules] = useState(initialRules); // Define rules state and its updater function
    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formData, setFormData] = useState({
        rules: "",
        comparison: "",
        amount: "",
        color: ""
    });

    const colors = [
        { name: "Red", value: "#ff0000" },
        { name: "Green", value: "#00ff00" },
        { name: "Blue", value: "#0000ff" },
        { name: "Yellow", value: "#ffff00" },
        { name: "Orange", value: "#ffa500" },
        { name: "Purple", value: "#800080" },
        { name: "Pink", value: "#ffc0cb" },
        { name: "Brown", value: "#a52a2a" },
        { name: "Gray", value: "#808080" },
        { name: "Black", value: "#000000" }
    ];

    /**
     * Get the row color based on product rules
     * This function checks the product's rules and returns the corresponding color based on the comparison and amount.
     * It prioritizes the rule with the lowest amount that matches the condition.
     * @param {Object} product - The product object.
     * @returns {string} - The color to apply to the row.
     */
    const getRowColor = (product) => {
        // Filter rules for the current product
        const productRules = rules.filter(rule => rule.product_id === product.product_id);

        // Sort rules by amount in ascending order
        const sortedRules = productRules.sort((a, b) => a.amount - b.amount);

        // Iterate through the sorted rules and apply the first matching rule's color
        for (const rule of sortedRules) {
            const { comparison, amount, color } = rule;
            switch (comparison) {
                case '=':
                    if (product.amount === amount) return color;
                    break;
                case '<':
                    if (product.amount < amount) return color;
                    break;
                case '>':
                    if (product.amount > amount) return color;
                    break;
                case '<=':
                    if (product.amount <= amount) return color;
                    break;
                case '>=':
                    if (product.amount >= amount) return color;
                    break;
                default:
                    break;
            }
        }
        return 'transparent'; // Default color if no rules are applied
    };

    /**
     * Export the product table to a PDF file
     * This function generates a PDF of the product table using jsPDF and jspdf-autotable.
     */
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFont("Arial"); // Set the font to Arial
        doc.text('Product Table', 14, 16);
        doc.autoTable({
            startY: 20,
            head: [['Product ID', 'Name', 'Amount', 'Unit', 'Category']], // Table headers
            body: products.map(product => [
                product.product_id, 
                product.product_name, 
                product.amount, 
                product.unit, 
                product.category
            ]), // Table body with product data
            theme: 'striped',
            headStyles: { fillColor: [22, 160, 133] },
            styles: { cellPadding: 2, fontSize: 10 },
        });
        doc.save('products.pdf');
    };

    /**
     * Fetch rules from the server
     * This function sends a GET request to fetch all rules and updates the state of the rule list.
     */
    const fetchRules = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/rules");
            setRules(response.data); // Update the state of the rule list
        } catch (error) {
            console.error("Error fetching rules:", error);
        }
    };

    /**
     * Handle input change for the rule form
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    /**
     * Handle form submit for the rule form
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/rules", { ...formData, product_id: currentProduct.product_id });
            setIsRuleModalOpen(false);
            setFormData({ rules: "", comparison: "", amount: "", color: "" });
            fetchRules(); // Fetch updated rules
        } catch (error) {
            console.error("Error adding rule:", error);
        }
    };

    /**
     * Open the rule modal for a specific product
     */
    const openRuleModal = (product) => {
        setCurrentProduct(product);
        setIsRuleModalOpen(true);
    };

    // Filter products based on selected categories
    const filteredProducts = selectedCategories.length
        ? products.filter(product => selectedCategories.includes(product.category))
        : products;

    return (
        <div className={styles.productTableContainer}>
            <div className={styles.controls}>
                <button className={styles.exportButton} onClick={exportToPDF}>Export as PDF</button>
                <button className={styles.addButton} onClick={onAddProductClick}>
                    Add Product
                </button>
            </div>
            <table ref={ref} className={styles.productTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Unit</th>
                        <th>Rules</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product) => (
                        <tr key={product.product_id} style={{ backgroundColor: getRowColor(product) }}>
                            <td>{product.product_id}</td>
                            <td>{product.product_name}</td>
                            <td>{product.category}</td>
                            <td>{product.amount}</td>
                            <td>{product.unit}</td>
                            <td className={styles.rulesCell}>
                                <CustomDropdown
                                    name="rules"
                                    value={rules.find(rule => rule.product_id === product.product_id && getRowColor(product) === rule.color)?.id || ""}
                                    onChange={() => {}}
                                    options={rules.filter(rule => rule.product_id === product.product_id)}
                                />
                            </td>
                            <td>
                                <button className={styles.editButton} onClick={() => onEditProduct(product)}>Edit</button>
                                <button className={styles.deleteButton} onClick={() => onDeleteProduct(product.product_id)}>Delete</button>
                                <button className={styles.addRuleButton} onClick={() => openRuleModal(product)}>Add Rule</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isRuleModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>Add Rule for {currentProduct.product_name}</h3>
                        <RuleForm
                            formData={formData}
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                            colors={colors}
                        />
                        <button className={styles.closeButton} onClick={() => setIsRuleModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
});

export default ProductTable;