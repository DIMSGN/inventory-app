import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentRule, setCurrentRule] = useState(null);

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

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
    setCurrentRule(null);
    setCurrentProduct(null);
    setEditingProduct(null);
  };

  return (
    <ModalContext.Provider 
      value={{ 
        activeModal, 
        modalData, 
        openModal, 
        closeModal,
        editingProduct,
        setEditingProduct,
        currentProduct,
        currentRule
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext); 