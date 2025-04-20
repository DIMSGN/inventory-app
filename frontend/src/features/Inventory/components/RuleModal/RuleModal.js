import React, { useEffect } from 'react';
import { Typography, Button } from 'antd';
import AddRuleForm from '../AddRuleForm/AddRuleForm';
import Modal from '../../../../common/components/Modal/Modal';

const { Title } = Typography;

/**
 * Modal component for adding and editing inventory rules
 * This component handles displaying the modal and managing rule submission
 */
const RuleModal = ({
  visible,
  onClose,
  currentProduct,
  currentRule,
  formData,
  handleChange,
  handleColorChange,
  handleAddRule,
  handleUpdateRule,
  initializeAddRule,
  initializeEditRule,
  isLoading
}) => {
  // Set up the form data when the modal is opened
  useEffect(() => {
    if (visible) {
      if (currentRule) {
        // If we have a currentRule, we're editing
        initializeEditRule(currentRule);
      } else if (currentProduct) {
        // If we have just a currentProduct, we're adding a new rule
        initializeAddRule(currentProduct);
      }
    }
  }, [currentRule, currentProduct, initializeAddRule, initializeEditRule, visible]);

  // Title for modal
  const modalTitle = currentRule ? 'Edit Rule' : 'Add New Rule';

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // If we have a currentRule, we're updating. Otherwise, we're adding.
      if (currentRule) {
        await handleUpdateRule(onClose);
      } else {
        await handleAddRule(onClose);
      }
    } catch (error) {
      console.error('Error submitting rule:', error);
      // Error handling will be done in the hook functions
    }
  };

  return (
    <Modal
      isOpen={visible}
      onClose={onClose}
      title={modalTitle}
    >
      <AddRuleForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleColorChange={handleColorChange}
        isLoading={isLoading}
        isEditing={!!currentRule}
      />
    </Modal>
  );
};

export default RuleModal; 