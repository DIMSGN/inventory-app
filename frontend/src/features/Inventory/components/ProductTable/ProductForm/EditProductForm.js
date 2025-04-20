import React, { useState, useEffect } from "react";
import styles from "./ProductForm.module.css";
import Button from "../../../../../common/components/Button";
import { useAppContext } from "../../../../../common/contexts/AppContext";
import { showError } from "../../../utils/utils";
import { Select } from 'antd';
import moment from 'moment';
import { DatePickerField } from "../../../../../common/components";
import "react-datepicker/dist/react-datepicker.css";

const { Option } = Select;

/**
 * EditProductForm component for editing existing products
 * @param {Object} props - Component props
 * @param {Object} props.product - The product to edit
 * @param {Function} props.onClose - Function to close the form
 * @param {Function} props.onUpdateProduct - Function to handle product updates
 */
const EditProductForm = ({ product, onClose }) => {
    const { 
        updateProduct, 
        categories, 
        units,
        suppliers,
        rules
    } = useAppContext();
    
    const [formData, setFormData] = useState({
        product_id: product?.product_id || "",
        product_name: product?.product_name || "",
        unit_id: product?.unit_id || "",
        category_id: product?.category_id || "",
        amount: product?.amount || "",
        purchase_price: product?.purchase_price || "",
        price: product?.price || "",
        pieces_per_package: product?.pieces_per_package || "",
        supplier_id: product?.supplier_id || "",
        received_date: product?.received_date || null,
        expiration_date: product?.expiration_date || null,
        price_per: product?.pieces_per_package ? "package" : "unit",
        source: product?.source || "direct"
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [productRules, setProductRules] = useState([]);

    // Load product-specific rules if available
    useEffect(() => {
        if (product && product.product_id && rules) {
            // Filter rules that match this product's ID
            const productSpecificRules = rules.filter(rule => 
                rule.product_id === product.product_id
            );
            setProductRules(productSpecificRules);
        }
    }, [product, rules]);

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
        setIsSubmitting(true);

        try {
            // Validate form data
            if (!formData.product_name || !formData.unit_id || !formData.category_id || !formData.purchase_price) {
                showError("Required fields: Product Name, Unit, Category, and Purchase Price");
                setIsSubmitting(false);
                return;
            }

            if (formData.pieces_per_package && isNaN(parseInt(formData.pieces_per_package, 10))) {
                showError("Pieces per package must be a valid number");
                setIsSubmitting(false);
                return;
            }

            // Prepare data for submission
            const submitData = {
                ...formData,
                unit_id: parseInt(formData.unit_id, 10),
                category_id: parseInt(formData.category_id, 10),
                amount: parseFloat(formData.amount) || 0,
                purchase_price: parseFloat(formData.purchase_price) || 0,
                price: formData.price ? parseFloat(formData.price) : null,
                pieces_per_package: formData.pieces_per_package ? parseInt(formData.pieces_per_package, 10) : null
            };

            console.log("Submitting updated product data:", submitData);
            const success = await updateProduct(product.product_id, submitData);
            if (success) {
                onClose();
            }
        } catch (error) {
            console.error("Error updating product:", error);
            showError(error.message || "Failed to update product");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.heading}>Edit Product</h2>
            
            <div className={styles.formSection}>
                <h3>Basic Information</h3>
                <label>
                    Product ID:
                    <input
                        type="text"
                        value={`#${product.product_id}`}
                        readOnly
                        className={styles.readonlyField}
                    />
                </label>
                
                <label>
                    Product Name: <span className={styles.required}>*</span>
                    <input
                        type="text"
                        name="product_name"
                        value={formData.product_name}
                        onChange={handleChange}
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
                            {units.map(unit => (
                                <Option key={unit.id} value={unit.id}>{unit.name}</Option>
                            ))}
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
                        {categories.map(cat => (
                            <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                        ))}
                    </Select>
                </label>
            </div>

            <div className={styles.formSection}>
                <h3>Pricing Information</h3>
                <div className={styles.formRow}>
                    <label className={styles.halfWidth}>
                        Purchase Price (Per Unit): <span className={styles.required}>*</span>
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
                        Pieces Per Package:
                        <input
                            type="number"
                            name="pieces_per_package"
                            value={formData.pieces_per_package}
                            onChange={handleChange}
                            min="0"
                            step="1"
                            placeholder="Number of pieces per package"
                        />
                        <small className={styles.helpText}>For packaged items (e.g., 6 bottles per box)</small>
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
                            {suppliers.map(supplier => (
                                <Option key={supplier.id} value={supplier.id}>{supplier.name}</Option>
                            ))}
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
                            <Option value="invoice">From Invoice</Option>
                        </Select>
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

            {productRules.length > 0 && (
                <div className={styles.formSection}>
                    <h3>Product Rules</h3>
                    <div className={styles.rulesList}>
                        {productRules.map(rule => (
                            <div key={rule.id} className={styles.ruleItem} style={{ borderColor: rule.color }}>
                                <span className={styles.ruleName}>{rule.rules}</span>
                                <span>
                                    {rule.comparison} {rule.amount} {product.unit_name || ''}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.formActions}>
                <Button type="button" onClick={onClose} variant="secondary">
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} variant="primary">
                    {isSubmitting ? "Updating..." : "Update Product"}
                </Button>
            </div>
        </form>
    );
};

export default EditProductForm;
