import React, { useState, useCallback, useEffect } from 'react';
import { Card, Button, Typography, Space, Spin, Alert } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useAppContext } from '../../../../common/contexts/AppContext';
import useRuleManagement from '../../hooks/useRuleManagement';
import RuleList from '../RuleList/RuleList';
import RuleModal from '../RuleModal/RuleModal';

const { Title, Text } = Typography;

/**
 * Component for managing inventory rules
 * Integrates the rule list and modal for a complete rule management interface
 */
const RuleManager = ({ currentProduct = null, openModalAutomatically = false }) => {
  // State for modal visibility
  const [modalVisible, setModalVisible] = useState(false);
  // State to track which rule is being edited
  const [editingRule, setEditingRule] = useState(null);
  // State for error messages 
  const [error, setError] = useState(null);

  // Get rule data from context
  const { rules, fetchRules, isLoading } = useAppContext();

  // Import methods from useRuleManagement
  const {
    formData,
    handleChange,
    handleColorChange,
    handleAddRule,
    handleUpdateRule,
    handleDeleteRule,
    initializeAddRule,
    initializeEditRule
  } = useRuleManagement();

  // Filter rules for the current product if specified
  const filteredRules = currentProduct
    ? rules.filter(rule => rule.product_id.toString() === currentProduct.product_id.toString())
    : rules;

  // Automatically open modal when product is selected from URL
  useEffect(() => {
    if (openModalAutomatically && currentProduct) {
      setEditingRule(null);
      setModalVisible(true);
    }
  }, [openModalAutomatically, currentProduct]);

  // Handle clicking the Add Rule button
  const handleAddRuleClick = useCallback(() => {
    setEditingRule(null);
    setModalVisible(true);
  }, []);

  // Handle clicking the Edit Rule button in the list
  const handleEditRuleClick = useCallback((rule) => {
    setEditingRule(rule);
    setModalVisible(true);
  }, []);
  
  // Handle clicking the Delete Rule button in the list
  const handleDeleteRuleClick = useCallback(async (ruleId) => {
    try {
      await handleDeleteRule(ruleId);
    } catch (error) {
      setError('Failed to delete rule. Please try again.');
    }
  }, [handleDeleteRule]);

  // Close the modal
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setEditingRule(null);
  }, []);

  // Load rules on component mount
  useEffect(() => {
    fetchRules().catch(err => {
      setError('Failed to load rules. Please try again.');
      console.error('Error loading rules:', err);
    });
  }, [fetchRules]);

  return (
    <Card 
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            {currentProduct ? 'Product Rules' : 'Inventory Rules'}
          </Title>
          {currentProduct && (
            <Text type="secondary">
              for {currentProduct.product_name}
            </Text>
          )}
        </Space>
      }
      extra={
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddRuleClick}
          >
            Add Rule
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchRules}
          >
            Refresh
          </Button>
        </Space>
      }
    >
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 16 }}
        />
      )}

      {isLoading.rules ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Loading rules...</div>
        </div>
      ) : (
        <RuleList
          rules={filteredRules}
          onEditRule={handleEditRuleClick}
          onDeleteRule={handleDeleteRuleClick}
        />
      )}

      {!filteredRules.length && !isLoading.rules && (
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddRuleClick}
          >
            Add Your First Rule
          </Button>
        </div>
      )}

      <RuleModal
        visible={modalVisible}
        onClose={handleCloseModal}
        currentProduct={currentProduct}
        currentRule={editingRule}
        formData={formData}
        handleChange={handleChange}
        handleColorChange={handleColorChange}
        handleAddRule={handleAddRule}
        handleUpdateRule={handleUpdateRule}
        initializeAddRule={initializeAddRule}
        initializeEditRule={initializeEditRule}
        isLoading={isLoading.rules}
      />
    </Card>
  );
};

export default RuleManager; 