import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, Typography, Tag, Empty } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

/**
 * Component to display a list of inventory rules with options to edit and delete
 */
const RuleList = ({ 
  rules = [], 
  onEditRule, 
  onDeleteRule,
  loading = false
}) => {
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState(null);

  // If no rules are available, display empty state
  if (rules.length === 0 && !loading) {
    return (
      <Empty
        description={
          <span>
            No rules found. Create a rule to set inventory alerts.
          </span>
        }
      />
    );
  }

  // Format comparison operator for display
  const formatComparison = (comparison) => {
    switch (comparison) {
      case '<': return 'Less than';
      case '>': return 'Greater than';
      case '<=': return 'Less than or equal to';
      case '>=': return 'Greater than or equal to';
      case '=': return 'Equal to';
      default: return comparison;
    }
  };

  // Handle delete confirmation
  const confirmDeleteRule = (ruleId) => {
    setRuleToDelete(ruleId);
    setDeleteConfirmVisible(true);
  };

  // Cancel delete
  const cancelDeleteRule = () => {
    setRuleToDelete(null);
    setDeleteConfirmVisible(false);
  };

  // Execute delete when confirmed
  const handleDeleteRuleConfirmed = () => {
    if (ruleToDelete && onDeleteRule) {
      onDeleteRule(ruleToDelete);
      setRuleToDelete(null);
      setDeleteConfirmVisible(false);
    }
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Rule Name',
      dataIndex: 'rules',
      key: 'rules',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Condition',
      key: 'condition',
      render: (_, record) => (
        <Space>
          <Text>{formatComparison(record.comparison)}</Text>
          <Text strong>{record.amount}</Text>
        </Space>
      )
    },
    {
      title: 'Alert Color',
      dataIndex: 'color',
      key: 'color',
      render: (color) => (
        <Tag 
          color={color} 
          style={{ 
            width: '60px', 
            height: '24px', 
            marginRight: 0,
            border: '1px solid #d9d9d9'
          }} 
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEditRule(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => confirmDeleteRule(record.id)}
          />
        </Space>
      )
    }
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={rules.map(rule => ({ ...rule, key: rule.id }))}
        loading={loading}
        pagination={rules.length > 10 ? { pageSize: 10 } : false}
        size="middle"
      />

      <Popconfirm
        title="Delete Rule"
        description="Are you sure you want to delete this rule? This action cannot be undone."
        icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
        open={deleteConfirmVisible}
        onConfirm={handleDeleteRuleConfirmed}
        onCancel={cancelDeleteRule}
        okText="Yes, delete"
        cancelText="No, keep it"
        okButtonProps={{ danger: true }}
        destroyTooltipOnHide={true}
      />
    </>
  );
};

export default RuleList;