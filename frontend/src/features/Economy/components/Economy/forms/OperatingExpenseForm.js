import React, { useState, useEffect } from 'react';
import { 
  Form, Input, Button, InputNumber, Select, Table, Popconfirm, 
  Typography, Divider, message, Row, Col, Card, Statistic, Badge, Tooltip
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, EditOutlined, SaveOutlined,
  ArrowUpOutlined, ArrowDownOutlined, EuroOutlined, CalendarOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { API_URL } from '../../../../../config';
import { DatePickerField } from '../../../../../common/components';
import '../styles/ExpenseForms.css';

const { Option } = Select;
const { Title, Text } = Typography;

// Expense categories
const EXPENSE_TYPES = [
  'Ενοικίαση',
  'Ηλεκτρισμός',
  'Νερό',
  'Τηλεπικοινωνίες',
  'Προμήθειες Κουζίνας',
  'Προμήθειες Μπαρ',
  'Καθαριστικά',
  'Συντήρηση',
  'Μάρκετινγκ',
  'Ασφάλιση',
  'Άδειες',
  'Λογιστικά',
  'Μεταφορικά',
  'Άλλο'
];

const OperatingExpenseForm = () => {
  const [form] = Form.useForm();
  const [operatingExpenses, setOperatingExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expenseStats, setExpenseStats] = useState({
    total: 0,
    monthTotal: 0,
    lastMonthTotal: 0,
    categoryBreakdown: {}
  });
  
  // Fetch operating expenses
  const fetchOperatingExpenses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/operating-expenses`);
      const expenses = response.data || [];
      setOperatingExpenses(expenses);
      
      // Calculate statistics
      calculateExpenseStats(expenses);
    } catch (error) {
      console.error('Error fetching operating expenses:', error);
      message.error('Failed to load operating expenses');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate expense statistics
  const calculateExpenseStats = (expenses) => {
    const now = moment();
    const currentMonth = now.format('YYYY-MM');
    const lastMonth = now.subtract(1, 'month').format('YYYY-MM');
    
    // Get total expenses
    const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    
    // Get current month expenses
    const monthTotal = expenses
      .filter(exp => moment(exp.expense_date).format('YYYY-MM') === currentMonth)
      .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    
    // Get last month expenses
    const lastMonthTotal = expenses
      .filter(exp => moment(exp.expense_date).format('YYYY-MM') === lastMonth)
      .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    
    // Get category breakdown
    const categoryBreakdown = {};
    expenses.forEach(exp => {
      const category = exp.expense_type;
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = 0;
      }
      categoryBreakdown[category] += parseFloat(exp.amount || 0);
    });
    
    setExpenseStats({
      total,
      monthTotal,
      lastMonthTotal,
      categoryBreakdown
    });
  };
  
  // Load data on component mount
  useEffect(() => {
    fetchOperatingExpenses();
  }, []);
  
  // Submit form
  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      
      // Format the date as needed for the API
      const formattedValues = {
        ...values,
        expense_date: moment(values.expense_date).format('YYYY-MM-DD')
      };
      
      const response = await axios.post(`${API_URL}/expenses/operating`, formattedValues);
      
      if (response.status === 201) {
        message.success('Το έξοδο προστέθηκε επιτυχώς!');
        form.resetFields();
        // Fetch updated expenses
        fetchOperatingExpenses();
      }
    } catch (error) {
      console.error('Error adding operating expense:', error);
      message.error('Υπήρξε πρόβλημα με την προσθήκη του εξόδου.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Delete expense
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/operating-expenses/${id}`);
      message.success('Expense deleted successfully');
      fetchOperatingExpenses();
    } catch (error) {
      console.error('Error deleting operating expense:', error);
      message.error('Failed to delete expense');
    }
  };
  
  // Calculate monthly change percentage
  const calculateMonthlyChange = () => {
    if (expenseStats.lastMonthTotal === 0) return 100;
    return ((expenseStats.monthTotal - expenseStats.lastMonthTotal) / expenseStats.lastMonthTotal) * 100;
  };
  
  // Get top expense categories
  const getTopExpenseCategories = () => {
    return Object.entries(expenseStats.categoryBreakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  };
  
  // Table columns
  const columns = [
    {
      title: 'Κατηγορία',
      dataIndex: 'expense_type',
      key: 'expense_type',
      filters: EXPENSE_TYPES.map(type => ({ text: type, value: type })),
      onFilter: (value, record) => record.expense_type === value,
      render: type => (
        <Badge color={getColorForCategory(type)} text={type} />
      )
    },
    {
      title: 'Ημερομηνία',
      dataIndex: 'expense_date',
      key: 'expense_date',
      render: date => moment(date).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.expense_date).unix() - moment(b.expense_date).unix()
    },
    {
      title: 'Ποσό (€)',
      dataIndex: 'amount',
      key: 'amount',
      render: amount => (
        <Text strong style={{ color: parseFloat(amount) > 500 ? '#ea3943' : '#1e1e1e' }}>
          {parseFloat(amount).toFixed(2)} €
        </Text>
      ),
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: 'Προμηθευτής',
      dataIndex: 'vendor',
      key: 'vendor'
    },
    {
      title: 'Σημειώσεις',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true
    },
    {
      title: 'Ενέργειες',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την εγγραφή;"
              onConfirm={() => handleDelete(record.id)}
              okText="Ναι"
              cancelText="Όχι"
            >
              <Button 
                icon={<DeleteOutlined />} 
                danger
                size="small"
              />
            </Popconfirm>
          </Tooltip>
        </div>
      )
    }
  ];

  // Edit expense
  const handleEdit = (record) => {
    // Set form values for editing
    form.setFieldsValue({
      ...record,
      expense_date: moment(record.expense_date)
    });
    
    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Get color for expense category
  const getColorForCategory = (category) => {
    const colors = {
      'Ενοικίαση': '#3861fb',
      'Ηλεκτρισμός': '#f3a712',
      'Νερό': '#00bcd4',
      'Τηλεπικοινωνίες': '#9c27b0',
      'Προμήθειες Κουζίνας': '#f44336',
      'Προμήθειες Μπαρ': '#ff9800',
      'Καθαριστικά': '#4caf50',
      'Συντήρηση': '#795548',
      'Μάρκετινγκ': '#e91e63',
      'Ασφάλιση': '#2196f3',
      'Άδειες': '#607d8b',
      'Λογιστικά': '#009688',
      'Μεταφορικά': '#8bc34a'
    };
    
    return colors[category] || '#9e9e9e';
  };
  
  // Calculate total amount
  const totalAmount = operatingExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
  
  // Monthly change
  const monthlyChange = calculateMonthlyChange();
  const isIncrease = monthlyChange > 0;
  
  return (
    <div className="operating-form-container">
      <div className="form-header">
        <h2>Λειτουργικά Έξοδα</h2>
      </div>
      
      {/* Metrics Dashboard */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-title">Συνολικά Έξοδα</div>
          <div className="metric-value">
            <EuroOutlined style={{ marginRight: '8px' }} />
            {expenseStats.total.toFixed(2)} €
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-title">Τρέχων Μήνας</div>
          <div className="metric-value">
            <CalendarOutlined style={{ marginRight: '8px' }} />
            {expenseStats.monthTotal.toFixed(2)} €
          </div>
          <div className={`metric-trend ${isIncrease ? 'negative' : 'positive'}`}>
            {isIncrease ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {Math.abs(monthlyChange).toFixed(1)}% από τον προηγούμενο μήνα
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-title">Κορυφαία Κατηγορία</div>
          <div className="metric-value">
            {getTopExpenseCategories()[0] ? getTopExpenseCategories()[0][0] : 'N/A'}
          </div>
          <div className="metric-trend">
            {getTopExpenseCategories()[0] ? 
              `${getTopExpenseCategories()[0][1].toFixed(2)} € (${((getTopExpenseCategories()[0][1] / expenseStats.total) * 100).toFixed(1)}%)` 
              : '0.00 €'}
          </div>
        </div>
      </div>
      
      {/* Expense Form */}
      <div className="section-card">
        <div className="card-header">
          <h3>Καταχώριση Νέου Εξόδου</h3>
        </div>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            expense_date: moment(),
            amount: 0
          }}
        >
          <div className="form-row">
            <Form.Item
              name="expense_type"
              label="Κατηγορία Εξόδων"
              rules={[{ required: true, message: 'Παρακαλώ επιλέξτε κατηγορία' }]}
              style={{ flex: 1 }}
            >
              <Select 
                placeholder="Επιλέξτε Κατηγορία"
                showSearch
                optionFilterProp="children"
              >
                {EXPENSE_TYPES.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="expense_date"
              label="Ημερομηνία"
              rules={[{ required: true, message: 'Παρακαλώ επιλέξτε ημερομηνία' }]}
              style={{ flex: 1 }}
              getValueProps={(value) => ({ selected: value })}
            >
              <DatePickerField 
                dateFormat="dd/MM/yyyy"
                isClearable={false}
                placeholder="Επιλέξτε ημερομηνία"
                width="full"
              />
            </Form.Item>
            
            <Form.Item
              name="amount"
              label="Ποσό (€)"
              rules={[{ required: true, message: 'Παρακαλώ εισάγετε ποσό' }]}
              style={{ flex: 1 }}
            >
              <InputNumber
                min={0}
                step={10}
                style={{ width: '100%' }}
                formatter={value => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/€\s?|(,*)/g, '')}
              />
            </Form.Item>
          </div>
          
          <div className="form-row">
            <Form.Item
              name="vendor"
              label="Προμηθευτής"
              style={{ flex: 1 }}
            >
              <Input placeholder="Όνομα προμηθευτή (προαιρετικά)" />
            </Form.Item>
            
            <Form.Item
              name="notes"
              label="Σημειώσεις"
              style={{ flex: 2 }}
            >
              <Input placeholder="Σημειώσεις (προαιρετικά)" />
            </Form.Item>
          </div>
          
          <div className="form-footer">
            <Button 
              type="default" 
              onClick={() => form.resetFields()}
            >
              Καθαρισμός
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SaveOutlined />}
              loading={submitting}
            >
              Αποθήκευση
            </Button>
          </div>
        </Form>
      </div>
      
      {/* Expenses Table */}
      <div className="expenses-table">
        <div className="card-header">
          <h3>Πρόσφατα Λειτουργικά Έξοδα</h3>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={fetchOperatingExpenses}
            loading={loading}
          >
            Ανανέωση
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={operatingExpenses}
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} από ${total} εγγραφές` 
          }}
          size="middle"
          scroll={{ x: 'max-content' }}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>Σύνολο</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text strong>{totalAmount.toFixed(2)} €</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} colSpan={3}></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>
    </div>
  );
};

export default OperatingExpenseForm; 