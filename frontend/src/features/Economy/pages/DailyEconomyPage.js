import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Form, Input, DatePicker, 
  InputNumber, Space, Popconfirm, Typography, Divider,
  Tabs, Statistic, Row, Col
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, EditOutlined, 
  SaveOutlined, BarChartOutlined, CalendarOutlined,
  ArrowUpOutlined, ArrowDownOutlined
} from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import config from '../../../config';
import './DailyEconomyPage.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const { API_URL } = config;

const DailyEconomyPage = () => {
  // State
  const [dailyRecords, setDailyRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  
  // Fetch data
  const fetchDailyRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/daily-economy`);
      setDailyRecords(response.data);
    } catch (error) {
      console.error('Error fetching daily records:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Load data on component mount
  useEffect(() => {
    fetchDailyRecords();
  }, []);
  
  // Handle form submit
  const handleSubmit = async (values) => {
    try {
      if (editingRecord) {
        // Update existing record
        await axios.put(`${API_URL}/daily-economy/${editingRecord.id}`, values);
      } else {
        // Create new record
        await axios.post(`${API_URL}/daily-economy`, values);
      }
      
      // Reset form and refresh data
      form.resetFields();
      setEditingRecord(null);
      fetchDailyRecords();
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };
  
  // Start editing a record
  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      record_date: moment(record.record_date)
    });
  };
  
  // Delete a record
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/daily-economy/${id}`);
      fetchDailyRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };
  
  // Cancel editing
  const handleCancel = () => {
    setEditingRecord(null);
    form.resetFields();
  };
  
  // Calculate summary statistics
  const calculateStats = () => {
    // Filter records for current month
    const currentMonthRecords = dailyRecords.filter(record => {
      const recordDate = moment(record.record_date);
      const currentMonth = moment().month();
      const currentYear = moment().year();
      
      return recordDate.month() === currentMonth && recordDate.year() === currentYear;
    });
    
    // Calculate totals for current month
    const totalIncome = currentMonthRecords.reduce((sum, record) => sum + (record.total_income || 0), 0);
    const totalExpenses = currentMonthRecords.reduce((sum, record) => sum + (record.payroll_expenses || 0) + (record.operating_expenses || 0), 0);
    const grossProfit = currentMonthRecords.reduce((sum, record) => sum + (record.gross_profit || 0), 0);
    
    return {
      totalIncome,
      totalExpenses,
      grossProfit,
      profitMargin: totalIncome > 0 ? (grossProfit / totalIncome) * 100 : 0
    };
  };
  
  const stats = calculateStats();
  
  // Table columns
  const columns = [
    {
      title: 'Ημερομηνία',
      dataIndex: 'record_date',
      key: 'record_date',
      render: date => moment(date).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.record_date).unix() - moment(b.record_date).unix(),
      defaultSortOrder: 'descend'
    },
    {
      title: 'Συνολικά Έσοδα',
      dataIndex: 'total_income',
      key: 'total_income',
      render: value => `€${value?.toFixed(2) || '0.00'}`,
      sorter: (a, b) => a.total_income - b.total_income
    },
    {
      title: 'Μικτό Κέρδος',
      dataIndex: 'gross_profit',
      key: 'gross_profit',
      render: value => `€${value?.toFixed(2) || '0.00'}`,
      sorter: (a, b) => a.gross_profit - b.gross_profit
    },
    {
      title: 'Μισθοδοσία',
      dataIndex: 'payroll_expenses',
      key: 'payroll_expenses',
      render: value => `€${value?.toFixed(2) || '0.00'}`,
      sorter: (a, b) => a.payroll_expenses - b.payroll_expenses
    },
    {
      title: 'Λειτουργικά Έξοδα',
      dataIndex: 'operating_expenses',
      key: 'operating_expenses',
      render: value => `€${value?.toFixed(2) || '0.00'}`,
      sorter: (a, b) => a.operating_expenses - b.operating_expenses
    },
    {
      title: 'Ενέργειες',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)} 
            size="small"
          />
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
        </Space>
      )
    }
  ];
  
  return (
    <div className="daily-economy-container">
      <Title level={2}>Ημερήσια Οικονομικά Στοιχεία</Title>
      
      <Row gutter={[24, 24]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Συνολικά Έσοδα Μήνα"
              value={stats.totalIncome}
              precision={2}
              prefix="€"
              valueStyle={{ color: '#3f8600' }}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Μικτό Κέρδος Μήνα"
              value={stats.grossProfit}
              precision={2}
              prefix="€"
              valueStyle={{ color: stats.grossProfit >= 0 ? '#3f8600' : '#cf1322' }}
              suffix={stats.grossProfit >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Περιθώριο Κέρδους"
              value={stats.profitMargin}
              precision={1}
              suffix="%"
              valueStyle={{ color: stats.profitMargin >= 20 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Συνολικά Έξοδα Μήνα"
              value={stats.totalExpenses}
              precision={2}
              prefix="€"
              valueStyle={{ color: '#cf1322' }}
              suffix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
      <Tabs defaultActiveKey="records" className="economy-tabs">
        <TabPane 
          tab={<span><CalendarOutlined /> Ημερήσιες Εγγραφές</span>} 
          key="records"
        >
          <Card title="Προσθήκη/Επεξεργασία Εγγραφής" className="form-card">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                record_date: moment(),
                total_income: 0,
                gross_profit: 0,
                payroll_expenses: 0,
                operating_expenses: 0
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    name="record_date"
                    label="Ημερομηνία"
                    rules={[{ required: true, message: 'Παρακαλώ επιλέξτε ημερομηνία' }]}
                  >
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    name="total_income"
                    label="Συνολικά Έσοδα"
                    rules={[{ required: true, message: 'Παρακαλώ εισάγετε τα συνολικά έσοδα' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      step={10}
                      formatter={value => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/€\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    name="gross_profit"
                    label="Μικτό Κέρδος"
                    rules={[{ required: true, message: 'Παρακαλώ εισάγετε το μικτό κέρδος' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      step={10}
                      formatter={value => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/€\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    name="payroll_expenses"
                    label="Μισθοδοσία"
                    rules={[{ required: true, message: 'Παρακαλώ εισάγετε τα έξοδα μισθοδοσίας' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      step={10}
                      formatter={value => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/€\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    name="operating_expenses"
                    label="Λειτουργικά Έξοδα"
                    rules={[{ required: true, message: 'Παρακαλώ εισάγετε τα λειτουργικά έξοδα' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      step={10}
                      formatter={value => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/€\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={loading}
                  >
                    {editingRecord ? 'Ενημέρωση' : 'Αποθήκευση'}
                  </Button>
                  
                  {editingRecord && (
                    <Button onClick={handleCancel}>Ακύρωση</Button>
                  )}
                </Space>
              </Form.Item>
            </Form>
          </Card>
          
          <Divider />
          
          <Card title="Ημερήσιες Εγγραφές">
            <Table
              columns={columns}
              dataSource={dailyRecords}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </TabPane>
        
        <TabPane 
          tab={<span><BarChartOutlined /> Ανάλυση</span>} 
          key="analysis"
        >
          <Card title="Ανάλυση Ημερήσιων Οικονομικών">
            <Text>Επερχόμενη λειτουργικότητα: Διαγράμματα και αναλύσεις ημερήσιων οικονομικών δεδομένων.</Text>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DailyEconomyPage; 