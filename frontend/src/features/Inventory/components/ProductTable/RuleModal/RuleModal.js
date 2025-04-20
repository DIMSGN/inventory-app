import React from 'react';
import Modal from '../../common/Modal/Modal';
import ColorSelect from '../../common/ColorSelect/ColorSelect';
import { colors } from '../../../utils/colors';
import styles from './RuleModal.module.css';

/**
 * RuleModal Component for adding or editing inventory rules
 */
const RuleModal = ({ 
  currentProduct, 
  formData, 
  handleChange, 
  handleSubmit, 
  setIsRuleModalOpen, 
  products, 
  rules, 
  setFormData,
  handleColorChange,
  isEditing 
}) => {
  const colorOptions = colors.map(color => ({
    value: color.value,
    label: color.name
  }));

  return (
    <Modal 
      onClose={() => setIsRuleModalOpen(false)}
      title={isEditing 
        ? `Edit Rule for ${currentProduct?.product_name || 'Product'}`
        : `Add Rule for ${currentProduct?.product_name || 'Product'}`
      }
    >
      {formData && (
        <form onSubmit={handleSubmit} className={styles.ruleForm}>
          {/* Product ID field - Auto-populated and read-only when currentProduct exists */}
          {currentProduct && (
            <div className={styles.formGroup}>
              <label>
                <i className="fas fa-barcode"></i> Product ID:
                <input
                  type="text"
                  name="product_id"
                  value={currentProduct.product_id || ""}
                  readOnly
                  disabled
                  className={styles.disabledInput}
                />
              </label>
            </div>
          )}
          
          {/* Product/Rule Name field */}
          <div className={styles.formGroup}>
            <label>
              <i className="fas fa-tag"></i> {currentProduct ? "Product Name:" : "Rule Name:"}
              <input
                type="text"
                name="rules"
                value={formData.rules || ""}
                onChange={handleChange}
                required
                placeholder={currentProduct ? "Product name" : "Enter rule name"}
                readOnly={currentProduct !== null}
                disabled={currentProduct !== null}
                className={currentProduct !== null ? styles.disabledInput : ""}
              />
            </label>
          </div>
          
          <div className={styles.formGroup}>
            <label>
              <i className="fas fa-not-equal"></i> Comparison:
              <select
                name="comparison"
                value={formData.comparison || "="}
                onChange={handleChange}
                required
              >
                <option value="=">=</option>
                <option value="<">&lt;</option>
                <option value=">">&gt;</option>
                <option value="<=">&lt;=</option>
                <option value=">=">&gt;=</option>
              </select>
            </label>
          </div>
          
          <div className={styles.formGroup}>
            <label>
              <i className="fas fa-calculator"></i> Amount:
              <input
                type="number"
                name="amount"
                value={formData.amount || ""}
                onChange={handleChange}
                required
                placeholder="Enter threshold amount"
              />
            </label>
          </div>
          
          <div className={styles.formGroup}>
            <label>
              <i className="fas fa-palette"></i> Color:
              <ColorSelect
                name="color"
                value={formData.color || "#ff0000"}
                onChange={handleColorChange}
                options={colorOptions}
              />
            </label>
          </div>
          
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>
              <i className="fas fa-save"></i> Save
            </button>
            <button 
              type="button" 
              className={styles.cancelButton} 
              onClick={() => setIsRuleModalOpen(false)}
            >
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default RuleModal; 