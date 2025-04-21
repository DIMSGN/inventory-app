import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  // Modal state
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  
  // Item state for different modal types
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentRule, setCurrentRule] = useState(null);

  /**
   * Open a modal with optional data
   * @param {string} modalType - Type of modal to open
   * @param {object} data - Optional data to pass to the modal
   */
  const openModal = (modalType, data = null) => {
    setActiveModal(modalType);
    setModalData(data);
    
    // Handle specific modal types
    if (modalType === 'rule') {
      if (data?.rule) {
        setCurrentRule(data.rule);
      } else {
        setCurrentRule(null);
      }
      
      if (data?.product) {
        setCurrentProduct(data.product);
      }
    } else if (modalType === 'edit-product') {
      setEditingProduct(data?.product || null);
    }
  };

  /**
   * Close the currently active modal
   */
  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
    setCurrentRule(null);
    setCurrentProduct(null);
    setEditingProduct(null);
  };

  const value = {
    // State
    activeModal, 
    modalData,
    editingProduct,
    currentProduct,
    currentRule,
    
    // Setters
    setEditingProduct,
    
    // Operations 
    openModal, 
    closeModal
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext; 