import React from 'react';
import { useModal } from '../contexts/ModalContext';
import RuleModal from '../../features/Inventory/components/RuleModal';

/**
 * Container component that renders the appropriate modal based on the
 * active modal state from ModalContext
 */
const ModalContainer = () => {
  const { 
    activeModal, 
    closeModal, 
    currentProduct, 
    currentRule
  } = useModal();

  // Render the appropriate modal based on the activeModal state
  const renderModal = () => {
    switch (activeModal) {
      case 'rule':
        return (
          <RuleModal
            currentProduct={currentProduct}
            currentRule={currentRule}
            isOpen={true}
            onClose={closeModal}
          />
        );
      
      // Add other modal cases here as needed
      // case 'product':
      //   return <ProductModal onClose={closeModal} />;
      
      default:
        return null;
    }
  };

  return renderModal();
};

export default ModalContainer; 