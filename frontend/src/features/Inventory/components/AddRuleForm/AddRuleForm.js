import React from 'react';
import { Form, Input, Select, Button, InputNumber, Row, Col } from 'antd';
import { SliderPicker } from 'react-color';

const { Option } = Select;

const comparisons = [
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' },
  { value: '=', label: '=' }
];

/**
 * Form component for adding inventory rules
 * This component is used both for creating new rules and editing existing ones
 */
const AddRuleForm = ({ 
  formData, 
  handleChange, 
  handleSubmit, 
  handleColorChange,
  isLoading,
  isEditing = false
}) => {
  // Find the selected color option for the slider
  const initialColor = formData.color || '#ff0000';

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Rule Name"
            name="rules"
            rules={[{ required: true, message: 'Please enter a rule name' }]}
          >
            <Input
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              placeholder="Rule Name"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item 
            label="Comparison" 
            name="comparison"
            rules={[{ required: true, message: 'Please select a comparison' }]}
          >
            <Select
              name="comparison"
              value={formData.comparison}
              onChange={(value) => handleChange({ target: { name: 'comparison', value } })}
            >
              {comparisons.map(comp => (
                <Option key={comp.value} value={comp.value}>
                  {comp.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item 
            label="Amount" 
            name="amount"
            rules={[{ required: true, message: 'Please enter an amount' }]}
          >
            <InputNumber
              name="amount"
              value={formData.amount}
              onChange={(value) => handleChange({ target: { name: 'amount', value } })}
              min={0}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Alert Color" name="color">
        <SliderPicker
          color={initialColor}
          onChange={(color) => handleColorChange({ value: color.hex })}
        />
      </Form.Item>

      <Row justify="end">
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={isLoading}
        >
          {isEditing ? 'Update Rule' : 'Add Rule'}
        </Button>
      </Row>
    </Form>
  );
};

export default AddRuleForm; 