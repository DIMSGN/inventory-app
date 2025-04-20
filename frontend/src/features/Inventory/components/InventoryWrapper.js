import React, { useState } from 'react';
import { useAppContext } from '../../../common/contexts/AppContext';
import { useModal } from '../../../common/contexts/ModalContext';
import InventoryPage from '../pages/InventoryPage';
import RuleList from './RuleList/RuleList';
import { useRuleManagement } from '../hooks';
import { Routes, Route } from 'react-router-dom';
import { RuleManagementPage, InventorySettingsPage } from '../pages';

/**
 * Wrapper component for Inventory feature that handles routing
 * for various inventory-related pages
 */
const InventoryWrapper = () => {
  const [showRuleList, setShowRuleList] = useState(false);
  const { rules } = useAppContext();
  const { openModal } = useModal();
  const { handleDeleteRule } = useRuleManagement();

  // Toggle rule list visibility
  const handleToggleRuleList = () => {
    setShowRuleList(!showRuleList);
  };

  // Open the rule modal
  const openRuleModal = (rule = null, product = null) => {
    openModal('rule', { rule, product });
  };

  return (
    <Routes>
      <Route path="/" element={<InventoryPage />} />
      <Route path="/rules" element={<RuleManagementPage />} />
      <Route path="/settings" element={<InventorySettingsPage />} />
    </Routes>
  );
};

export default InventoryWrapper; 