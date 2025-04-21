import React, { useState, useEffect, useRef } from "react";
import styles from "./ProductForm.module.css";
import Button from "../../../../../common/components/Button";
import { DatePickerField } from "../../../../../common/components";
import { useAppContext } from "../../../../../common/contexts/AppContext";
import { showError } from "../../../utils/utils";
import { deleteCategory as deleteCategoryUtil } from "../../../utils/categoryUtils";
import { Select } from 'antd';
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";

const { Option } = Select;

/**
 * Generates the next sequential product ID
 * @param {Array} products - Array of existing products
 * @returns {number} Next available product ID
 */
const getNextProductId = (products) => {
    if (!products || products.length === 0) {
        return 1; // Start with 1 if no products exist
    }
    
    // Find the current highest product_id
    const highestId = Math.max(...products.map(product => 
        // Ensure we're comparing numbers
        typeof product.product_id === 'string' 
            ? parseInt(product.product_id, 10) 
            : product.product_id
    ));
    
    return highestId + 1;
};

/**
 * AddProductForm component for adding new products
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Function to close the form
 */
const AddProductForm = ({ onClose }) => {
    const { 
        addProduct, 
        addCategory, 
        fetchCategories, 
        categories, 
        products, 
        setCategories,
        units,
        suppliers // Add suppliers context
    } = useAppContext();
    
    const [newCategory, setNewCategory] = useState("");
    const [formData, setFormData] = useState({
        product_name: "",
        unit_id: "",
        category_id: "",
        amount: "",
        price: "", // Optional selling price
        purchase_price: "", // Required purchase price
        pieces_per_package: "",
        price_per: "unit", // "unit" or "package"
        received_date: moment().format('YYYY-MM-DD'),
        expiration_date: moment().add(1, 'year').format('YYYY-MM-DD')
    });
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const productNameRef = useRef(null);

    // Set initial product ID when products load
    useEffect(() => {
        if (products && products.length >= 0) {
            const nextId = getNextProductId(products);
            setFormData(prevState => ({
                ...prevState,
                product_id: nextId
            }));
        }
    }, [products]);

    useEffect(() => {
        // Focus on product_name field
        if (productNameRef.current) {
            productNameRef.current.focus();
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSelectChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleDateChange = (name, date) => {
        setFormData({
            ...formData,
            [name]: date ? moment(date).format('YYYY-MM-DD') : null
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.product_name || !formData.category_id || !formData.unit_id || !formData.purchase_price) {
            return showError("Product name, category, unit, and purchase price are required");
        }

        // Track submission state
        setIsSubmitting(true);

        // Format the product data
        const productData = {
            ...formData,
            purchase_price: parseFloat(formData.purchase_price) || 0,
            price: formData.price ? parseFloat(formData.price) : null,
            amount: parseFloat(formData.amount) || 0,
            pieces_per_package: formData.pieces_per_package ? parseInt(formData.pieces_per_package, 10) : null
        };

        try {
            const success = await addProduct(productData);
            
            if (success) {
                setFormData({
                    product_name: "",
                    category_id: "",
                    unit_id: "",
                    purchase_price: "",
                    price: "",
                    amount: "0",
                    pieces_per_package: ""
                });
                onClose();
            }
        } catch (error) {
            console.error("Error adding product:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) {
            showError("Category name cannot be empty");
            return;
        }

        if (categories.some(cat => cat.name === newCategory.trim())) {
            showError("Category already exists");
            return;
        }

        try {
            await addCategory(newCategory);
            setNewCategory("");
        } catch (error) {
            console.error("Error adding category:", error);
            showError(error.message || "Failed to add category");
        }
    };

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) {
            showError("Please select a category to delete");
            return;
        }

        // Log the category to delete information
        console.log("Category to delete:", categoryToDelete);
        console.log("Selected category type:", typeof categoryToDelete);
        console.log("All categories:", categories);
        
        // Find the full category object
        const categoryObj = categories.find(cat => cat.id === categoryToDelete || cat.name === categoryToDelete);
        console.log("Found category object:", categoryObj);

        try {
            if (!categoryObj) {
                throw new Error(`Could not find category with ID: ${categoryToDelete}`);
            }

            // Pass the category object instead of just the ID
            await deleteCategoryUtil(categoryObj, categories, setCategories, fetchCategories, products);
            setCategoryToDelete(null);
            
            // If deleted category was selected in the form, reset it
            if (formData.category_id === categoryToDelete) {
                setFormData({
                    ...formData,
                    category_id: ""
                });
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            showError(error.message || "Failed to delete category");
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.heading}>Add New Product</h2>
            
            <div className={styles.formSection}>
                <label>
                    Product Name: <span className={styles.required}>*</span>
                    <input
                        type="text"
                        name="product_name"
                        value={formData.product_name}
                        onChange={handleChange}
                        ref={productNameRef}
                        required
                    />
                </label>

                <div className={styles.formRow}>
                    <label className={styles.halfWidth}>
                        Unit: <span className={styles.required}>*</span>
                        <Select
                            value={formData.unit_id}
                            onChange={(value) => handleSelectChange('unit_id', value)}
                            style={{ width: '100%' }}
                        >
                            <Option value="">Select Unit</Option>
                            {Array.isArray(units) ? units.map(unit => (
                                <Option key={unit.id} value={unit.id}>{unit.name}</Option>
                            )) : null}
                        </Select>
                    </label>

                    <label className={styles.halfWidth}>
                        Amount: <span className={styles.required}>*</span>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                        />
                    </label>
                </div>

                <label>
                    Category: <span className={styles.required}>*</span>
                    <Select
                        value={formData.category_id}
                        onChange={(value) => handleSelectChange('category_id', value)}
                        style={{ width: '100%' }}
                    >
                        <Option value="">Select Category</Option>
                        {Array.isArray(categories) ? categories.map(cat => (
                            <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                        )) : null}
                    </Select>
                </label>

                <div className={styles.categoryActions}>
                    <div>
                        <h4 style={{ margin: "0 0 10px 0", color: "#4b5563", fontSize: "14px" }}>Add New Category</h4>
                        <div className={styles.addCategory}>
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="New category name"
                            />
                            <Button 
                                type="button" 
                                onClick={handleAddCategory}
                                variant="secondary"
                            >
                                Add Category
                            </Button>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ margin: "0 0 10px 0", color: "#4b5563", fontSize: "14px" }}>Remove Existing Category</h4>
                        <div className={styles.deleteCategory}>
                            <Select
                                value={categoryToDelete}
                                onChange={setCategoryToDelete}
                                style={{ width: '100%' }}
                                placeholder="Select category to delete"
                            >
                                {Array.isArray(categories) ? categories.map(cat => (
                                    <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                                )) : null}
                            </Select>
                            <Button 
                                type="button" 
                                onClick={handleDeleteCategory}
                                variant="danger"
                            >
                                Delete Category
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.formSection}>
                <h3>Supplier Information</h3>
                <div className={styles.formRow}>
                    <label className={styles.halfWidth}>
                        Supplier:
                        <Select
                            value={formData.supplier_id}
                            onChange={(value) => handleSelectChange('supplier_id', value)}
                            style={{ width: '100%' }}
                        >
                            <Option value="">Select Supplier</Option>
                            {Array.isArray(suppliers) ? suppliers.map(supplier => (
                                <Option key={supplier.id} value={supplier.id}>{supplier.name}</Option>
                            )) : null}
                        </Select>
                    </label>
                    <label className={styles.halfWidth}>
                        Source:
                        <Select
                            value={formData.source}
                            onChange={(value) => handleSelectChange('source', value)}
                            style={{ width: '100%' }}
                        >
                            <Option value="direct">Direct Purchase</Option>
                            <Option value="invoice">Invoice</Option>
                        </Select>
                    </label>
                </div>
            </div>

            <div className={styles.formSection}>
                <h3>Pricing Information</h3>
                <div className={styles.formRow}>
                    <label className={styles.halfWidth}>
                        Purchase Price : <span className={styles.required}>*</span>
                        <input
                            type="number"
                            name="purchase_price"
                            value={formData.purchase_price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                            placeholder="Purchase price"
                        />
                    </label>

                    <label className={styles.halfWidth}>
                        Package Info:
                        <div className={styles.packageInfo}>
                            <input
                                type="number"
                                name="pieces_per_package"
                                value={formData.pieces_per_package}
                                onChange={handleChange}
                                min="0"
                                step="1"
                                placeholder="Pieces per package"
                            />
                            <small className={styles.helpText}>For packaged items (e.g., 6 bottles per box)</small>
                        </div>
                    </label>
                </div>
                
                <div className={styles.formRow}>
                    <label className={styles.fullWidth}>
                        Selling Price (Optional):
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            placeholder="Selling price (if applicable)"
                        />
                        <small className={styles.helpText}>Only needed for products sold directly (not used as ingredients)</small>
                    </label>
                </div>
            </div>

            <div className={styles.formSection}>
                <h3>Dates</h3>
                <div className={styles.formRow}>
                    <DatePickerField
                        label="Received Date"
                        name="received_date"
                        selected={formData.received_date ? new Date(formData.received_date) : null}
                        onChange={handleDateChange}
                        isClearable={true}
                        width="half"
                    />
                    <DatePickerField
                        label="Expiration Date"
                        name="expiration_date"
                        selected={formData.expiration_date ? new Date(formData.expiration_date) : null}
                        onChange={handleDateChange}
                        isClearable={true}
                        width="half"
                    />
                </div>
            </div>

            <div className={styles.formActions}>
                <Button type="button" onClick={onClose} variant="secondary">
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} variant="primary">
                    {isSubmitting ? "Adding..." : "Add Product"}
                </Button>
            </div>
        </form>
    );
};

export default AddProductForm;