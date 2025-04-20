import React, { useState, useEffect } from 'react';
import { 
  Form, Input, Button, InputNumber, Select, Table, Popconfirm, 
  Typography, Divider, message, Badge, Tooltip 
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, EditOutlined, SaveOutlined,
  ArrowUpOutlined, ArrowDownOutlined, EuroOutlined, UserOutlined,
  TeamOutlined, ReloadOutlined
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { API_URL } from '../../../../../config';
import { DatePickerField } from '../../../../../common/components';
import '../styles/ExpenseForms.css';

const { Option } = Select;
const { Title, Text } = Typography;

// Employee positions/departments
const POSITIONS = [
  'Μάγειρας',
  'Βοηθός Μάγειρα',
  'Σερβιτόρος',
  'Μπάρμαν',
  'Ταμίας',
  'Διοίκηση',
  'Καθαριότητα',
  'Άλλο'
];

const PayrollExpenseForm = () => {
  const [form] = Form.useForm();
  const [payrollExpenses, setPayrollExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [payrollStats, setPayrollStats] = useState({
    total: 0,
    monthTotal: 0,
    lastMonthTotal: 0,
    employeeCount: 0,
    averageSalary: 0,
    positionBreakdown: {}
  });
  
  // Fetch payroll expenses
  const fetchPayrollExpenses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/payroll-expenses`);
      const expenses = response.data || [];
      setPayrollExpenses(expenses);
      
      // Calculate statistics
      calculatePayrollStats(expenses);
    } catch (error) {
      console.error('Error fetching payroll expenses:', error);
      message.error('Failed to load payroll expenses');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate payroll statistics
  const calculatePayrollStats = (expenses) => {
    const now = moment();
    const currentMonth = now.format('YYYY-MM');
    const lastMonth = now.subtract(1, 'month').format('YYYY-MM');
    
    // Get total expenses
    const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    
    // Get current month expenses
    const monthExpenses = expenses.filter(exp => moment(exp.payroll_date).format('YYYY-MM') === currentMonth);
    const monthTotal = monthExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    
    // Get last month expenses
    const lastMonthTotal = expenses
      .filter(exp => moment(exp.payroll_date).format('YYYY-MM') === lastMonth)
      .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    
    // Count unique employees this month
    const uniqueEmployees = new Set(monthExpenses.map(exp => exp.employee_name));
    const employeeCount = uniqueEmployees.size;
    
    // Calculate average salary
    const averageSalary = employeeCount > 0 ? monthTotal / employeeCount : 0;
    
    // Get position breakdown
    const positionBreakdown = {};
    expenses.forEach(exp => {
      const position = exp.position;
      if (!positionBreakdown[position]) {
        positionBreakdown[position] = 0;
      }
      positionBreakdown[position] += parseFloat(exp.amount || 0);
    });
    
    setPayrollStats({
      total,
      monthTotal,
      lastMonthTotal,
      employeeCount,
      averageSalary,
      positionBreakdown
    });
  };
  
  // Load data on component mount
  useEffect(() => {
    fetchPayrollExpenses();
  }, []);
  
  // Submit form
  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      
      // Format the date as needed for the API
      const formattedValues = {
        ...values,
        payroll_date: moment(values.payroll_date).format('YYYY-MM-DD')
      };
      
      const response = await axios.post(`${API_URL}/expenses/payroll`, formattedValues);
      
      if (response.status === 201) {
        message.success('Η πληρωμή προστέθηκε επιτυχώς!');
        form.resetFields();
        // Fetch updated expenses
        fetchPayrollExpenses();
      }
    } catch (error) {
      console.error('Error adding payroll expense:', error);
      message.error('Υπήρξε πρόβλημα με την προσθήκη της πληρωμής.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Delete expense
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/payroll-expenses/${id}`);
      message.success('Payroll record deleted successfully');
      fetchPayrollExpenses();
    } catch (error) {
      console.error('Error deleting payroll expense:', error);
      message.error('Failed to delete payroll record');
    }
  };
  
  // Edit expense
  const handleEdit = (record) => {
    // Set form values for editing
    form.setFieldsValue({
      ...record,
      payroll_date: moment(record.payroll_date)
    });
    
    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Calculate monthly change percentage
  const calculateMonthlyChange = () => {
    if (payrollStats.lastMonthTotal === 0) return 100;
    return ((payrollStats.monthTotal - payrollStats.lastMonthTotal) / payrollStats.lastMonthTotal) * 100;
  };
  
  // Get top positions by pay
  const getTopPositions = () => {
    return Object.entries(payrollStats.positionBreakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  };
  
  // Get color for position
  const getColorForPosition = (position) => {
    const colors = {
      'Μάγειρας': '#f44336',
      'Βοηθός Μάγειρα': '#ff9800',
      'Σερβιτόρος': '#3861fb',
      'Μπάρμαν': '#9c27b0',
      'Ταμίας': '#2196f3',
      'Διοίκηση': '#4caf50',
      'Καθαριότητα': '#00bcd4',
      'Άλλο': '#9e9e9e'
    };
    
    return colors[position] || '#9e9e9e';
  };
  
  // Table columns
  const columns = [
    {
      title: 'Όνομα Εργαζομένου',
      dataIndex: 'employee_name',
      key: 'employee_name',
      sorter: (a, b) => a.employee_name.localeCompare(b.employee_name)
    },
    {
      title: 'Θέση',
      dataIndex: 'position',
      key: 'position',
      filters: POSITIONS.map(pos => ({ text: pos, value: pos })),
      onFilter: (value, record) => record.position === value,
      render: position => (
        <Badge color={getColorForPosition(position)} text={position} />
      )
    },
    {
      title: 'Ημερομηνία Πληρωμής',
      dataIndex: 'payroll_date',
      key: 'payroll_date',
      render: date => moment(date).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.payroll_date).unix() - moment(b.payroll_date).unix()
    },
    {
      title: 'Ποσό (€)',
      dataIndex: 'amount',
      key: 'amount',
      render: amount => (
        <Text strong style={{ color: parseFloat(amount) > 1000 ? '#ea3943' : '#1e1e1e' }}>
          {parseFloat(amount).toFixed(2)} €
        </Text>
      ),
      sorter: (a, b) => a.amount - b.amount
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
  
  // Calculate total amount
  const totalAmount = payrollExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
  
  // Monthly change
  const monthlyChange = calculateMonthlyChange();
  const isIncrease = monthlyChange > 0;
  
  return (
    <div className="payroll-form-container">
      <div className="form-header">
        <h2>Μισθοδοσία Προσωπικού</h2>
      </div>
      
      {/* Metrics Dashboard */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-title">Σύνολο Μισθοδοσίας</div>
          <div className="metric-value">
            <EuroOutlined style={{ marginRight: '8px' }} />
            {payrollStats.total.toFixed(2)} €
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-title">Τρέχων Μήνας</div>
          <div className="metric-value">
            <TeamOutlined style={{ marginRight: '8px' }} />
            {payrollStats.monthTotal.toFixed(2)} €
          </div>
          <div className={`metric-trend ${isIncrease ? 'negative' : 'positive'}`}>
            {isIncrease ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {Math.abs(monthlyChange).toFixed(1)}% από τον προηγούμενο μήνα
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-title">Στοιχεία Προσωπικού</div>
          <div className="metric-value">
            <UserOutlined style={{ marginRight: '8px' }} />
            {payrollStats.employeeCount} εργαζόμενοι
          </div>
          <div className="metric-trend">
            Μέσος μισθός: {payrollStats.averageSalary.toFixed(2)} €
          </div>
        </div>
      </div>
      
      {/* Payroll Form */}
      <div className="section-card">
        <div className="card-header">
          <h3>Καταχώριση Νέας Πληρωμής</h3>
        </div>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            payroll_date: moment(),
            amount: 0
          }}
        >
          <div className="form-row">
            <Form.Item
              name="employee_name"
              label="Όνομα Εργαζομένου"
              rules={[{ required: true, message: 'Παρακαλώ εισάγετε το όνομα του εργαζομένου' }]}
              style={{ flex: 2 }}
            >
              <Input placeholder="Όνομα Εργαζομένου" />
            </Form.Item>
            
            <Form.Item
              name="position"
              label="Θέση"
              rules={[{ required: true, message: 'Παρακαλώ επιλέξτε θέση' }]}
              style={{ flex: 1 }}
            >
              <Select 
                placeholder="Επιλέξτε Θέση"
                showSearch
                optionFilterProp="children"
              >
                {POSITIONS.map(position => (
                  <Option key={position} value={position}>{position}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="payroll_date"
              label="Ημερομηνία Πληρωμής"
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
          
          <Form.Item
            name="notes"
            label="Σημειώσεις"
          >
            <Input.TextArea 
              rows={2} 
              placeholder="Σημειώσεις (προαιρετικά)" 
            />
          </Form.Item>
          
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
      
      {/* Payroll Table */}
      <div className="expenses-table">
        <div className="card-header">
          <h3>Πρόσφατες Πληρωμές Μισθοδοσίας</h3>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={fetchPayrollExpenses}
            loading={loading}
          >
            Ανανέωση
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={payrollExpenses}
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
                <Table.Summary.Cell index={0} colSpan={3}>Σύνολο</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text strong>{totalAmount.toFixed(2)} €</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} colSpan={2}></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>
    </div>
  );
};

export default PayrollExpenseForm; 