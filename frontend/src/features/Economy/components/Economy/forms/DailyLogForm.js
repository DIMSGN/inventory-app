import React, { useState } from 'react';
import { 
  Form, Input, Button, Select, DatePicker, InputNumber, 
  Card, Typography, Space, Divider, Alert, message 
} from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useEconomy } from '../../contexts/EconomyContext';
import '../../styles/DailyLog.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const DailyLogForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { addDailyLogEntry, isUsingMockData } = useEconomy();
  
  // Category options
  const categoryOptions = [
    { value: 'sales', label: 'Sales Income' },
    { value: 'expense', label: 'Expense' }
  ];
  
  // Subcategory options (dynamically change based on selected category)
  const getSubcategoryOptions = (category) => {
    if (category === 'sales') {
      return [
        { value: 'FOOD', label: 'Food' },
        { value: 'WINE', label: 'Wine' },
        { value: 'ΠΟΤΑ', label: 'Drinks' },
        { value: 'ΜΠΥΡΕΣ', label: 'Beer' },
        { value: 'CAFÉ', label: 'Café' },
        { value: 'EVENTS', label: 'Events' }
      ];
    } else if (category === 'expense') {
      return [
        // Cost of Goods
        { value: 'FOOD', label: 'Food Supplies' },
        { value: 'WINE', label: 'Wine Supplies' },
        { value: 'ΠΟΤΑ', label: 'Drink Supplies' },
        { value: 'ΜΠΥΡΕΣ', label: 'Beer Supplies' },
        { value: 'CAFÉ', label: 'Café Supplies' },
        
        // Payroll
        { value: 'ΤΑΜΕΙΑΣ', label: 'Cashier Salary' },
        { value: 'ΣΕΡΒΙΤΟΡΟΣ', label: 'Waiter Salary' },
        { value: 'ΜΑΓΕΙΡΑΣ', label: 'Chef Salary' },
        { value: 'ΜΠΑΡΜΑΝ', label: 'Barman Salary' },
        { value: 'ΚΑΘΑΡΙΣΤΗΣ', label: 'Cleaner Salary' },
        
        // Utilities
        { value: 'ΔΕΗ', label: 'Electricity' },
        { value: 'ΕΥΔΑΠ', label: 'Water' },
        { value: 'ΟΤΕ', label: 'Phone' },
        { value: 'ΕΝΟΙΚΙΟ', label: 'Rent' },
        { value: 'INTERNET', label: 'Internet' },
        
        // Other
        { value: 'ΔΙΑΦΗΜΙΣΗ', label: 'Advertising' },
        { value: 'ΣΥΝΤΗΡΗΣΗ', label: 'Maintenance' },
        { value: 'ΕΞΟΠΛΙΣΜΟΣ', label: 'Equipment' },
        { value: 'ΑΝΑΛΩΣΙΜΑ', label: 'Supplies' },
        { value: 'ΛΟΙΠΙΚΑ', label: 'Miscellaneous' }
      ];
    }
    
    return [];
  };
  
  // Category change handler
  const handleCategoryChange = (value) => {
    // Reset subcategory when category changes
    form.setFieldsValue({ subcategory: undefined });
  };
  
  // Form submit handler
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      // Format date value
      const entry = {
        ...values,
        date: values.date.format('YYYY-MM-DD')
      };
      
      // Add daily log entry
      const success = await addDailyLogEntry(entry);
      
      if (success) {
        form.resetFields();
        message.success('Daily log entry added successfully');
      }
    } catch (error) {
      console.error('Error submitting daily log:', error);
      message.error('Failed to add daily log entry');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card title="Add Daily Financial Entry" className="daily-log-form-card">
      {isUsingMockData && (
        <Alert
          message="Using Demo Mode"
          description="You are currently in demo mode. Entries will be saved locally but not to the server."
          type="info"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      )}
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          date: moment(),
          amount: 0
        }}
      >
        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: 'Please select a date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select 
            placeholder="Select category" 
            onChange={handleCategoryChange}
          >
            {categoryOptions.map(option => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          name="subcategory"
          label="Subcategory"
          dependencies={['category']}
          rules={[{ required: true, message: 'Please select a subcategory' }]}
        >
          <Select placeholder="Select subcategory">
            {form.getFieldValue('category') && 
              getSubcategoryOptions(form.getFieldValue('category')).map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          name="amount"
          label="Amount (€)"
          rules={[
            { required: true, message: 'Please enter an amount' },
            { type: 'number', min: 0, message: 'Amount must be a positive number' }
          ]}
        >
          <InputNumber 
            style={{ width: '100%' }} 
            precision={2} 
            formatter={value => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/€\s?|(,*)/g, '')}
          />
        </Form.Item>
        
        <Form.Item
          name="notes"
          label="Notes"
        >
          <TextArea rows={3} placeholder="Add any relevant notes about this entry" />
        </Form.Item>
        
        <Divider />
        
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={loading}
            block
          >
            Add Financial Entry
          </Button>
        </Form.Item>
      </Form>
      
      <div className="daily-log-info">
        <Text type="secondary">
          Daily entries will be automatically aggregated into the monthly financial data.
          For example, adding a sales entry for April 18, 2023 will increase the April column in the financial spreadsheet.
        </Text>
      </div>
    </Card>
  );
};

export default DailyLogForm; 