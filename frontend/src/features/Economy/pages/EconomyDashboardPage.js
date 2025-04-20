import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Statistic, Space, Divider, 
  Typography, Tabs, Table, Alert, Spin 
} from 'antd';
import { 
  ArrowUpOutlined, ArrowDownOutlined, LineChartOutlined, 
  CalendarOutlined, DollarOutlined, BarChartOutlined 
} from '@ant-design/icons';
import axios from 'axios';
import config from '../../../config';
import { Link } from 'react-router-dom';
import moment from 'moment';
import './DashboardPage.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const { API_URL } = config;

const EconomyDashboardPage = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0
  });

  // Fetch data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Current month boundaries
        const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
        const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');
        
        // Fetch daily economy records
        const dailyResponse = await axios.get(`${API_URL}/daily-economy/range/${startOfMonth}/${endOfMonth}`);
        
        // Process data
        if (dailyResponse.data && dailyResponse.data.length > 0) {
          setDailyData(dailyResponse.data);
          
          // Calculate monthly totals
          const totalRevenue = dailyResponse.data.reduce((sum, record) => sum + (parseFloat(record.total_income) || 0), 0);
          const totalExpenses = dailyResponse.data.reduce((sum, record) => 
            sum + (parseFloat(record.payroll_expenses) || 0) + (parseFloat(record.operating_expenses) || 0), 0);
          const netProfit = dailyResponse.data.reduce((sum, record) => sum + (parseFloat(record.gross_profit) || 0), 0);
          
          setMonthlySummary({
            totalRevenue,
            totalExpenses,
            netProfit,
            profitMargin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
          });
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Σφάλμα κατά τη φόρτωση των δεδομένων. Παρακαλώ προσπαθήστε ξανά.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Columns for the daily data table
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
      title: 'Έσοδα',
      dataIndex: 'total_income',
      key: 'total_income',
      render: value => `€${parseFloat(value).toFixed(2)}`,
      sorter: (a, b) => a.total_income - b.total_income
    },
    {
      title: 'Μικτό Κέρδος',
      dataIndex: 'gross_profit',
      key: 'gross_profit',
      render: value => `€${parseFloat(value).toFixed(2)}`,
      sorter: (a, b) => a.gross_profit - b.gross_profit
    },
    {
      title: 'Έξοδα Μισθοδοσίας',
      dataIndex: 'payroll_expenses',
      key: 'payroll_expenses',
      render: value => `€${parseFloat(value).toFixed(2)}`,
      sorter: (a, b) => a.payroll_expenses - b.payroll_expenses
    },
    {
      title: 'Λειτουργικά Έξοδα',
      dataIndex: 'operating_expenses',
      key: 'operating_expenses',
      render: value => `€${parseFloat(value).toFixed(2)}`,
      sorter: (a, b) => a.operating_expenses - b.operating_expenses
    }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <Text>Φόρτωση δεδομένων...</Text>
      </div>
    );
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  return (
    <div className="economy-dashboard-container">
      <Title level={2}>Οικονομικός Πίνακας Ελέγχου</Title>
      <Text>Επισκόπηση οικονομικών στοιχείων για {moment().format('MMMM YYYY')}</Text>
      
      <Divider />
      
      {/* Summary Cards */}
      <Row gutter={[24, 24]} className="summary-row">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Συνολικά Έσοδα Μήνα"
              value={monthlySummary.totalRevenue}
              precision={2}
              prefix="€"
              valueStyle={{ color: '#3f8600' }}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Συνολικά Έξοδα Μήνα"
              value={monthlySummary.totalExpenses}
              precision={2}
              prefix="€"
              valueStyle={{ color: '#cf1322' }}
              suffix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Καθαρό Κέρδος"
              value={monthlySummary.netProfit}
              precision={2}
              prefix="€"
              valueStyle={{ 
                color: monthlySummary.netProfit >= 0 ? '#3f8600' : '#cf1322' 
              }}
              suffix={
                monthlySummary.netProfit >= 0 
                  ? <ArrowUpOutlined /> 
                  : <ArrowDownOutlined />
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Περιθώριο Κέρδους"
              value={monthlySummary.profitMargin}
              precision={1}
              suffix="%"
              valueStyle={{ 
                color: monthlySummary.profitMargin >= 20 ? '#3f8600' : '#cf1322' 
              }}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Shortcuts to other Economy sections */}
      <Row gutter={[24, 24]} className="shortcuts-row">
        <Col xs={24} sm={8}>
          <Card className="shortcut-card">
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <DollarOutlined style={{ fontSize: 32 }} />
              <Text strong>Ημερήσια Οικονομικά</Text>
              <Link to="/economy/daily">Μετάβαση</Link>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shortcut-card">
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <LineChartOutlined style={{ fontSize: 32 }} />
              <Text strong>Οικονομικό Φύλλο</Text>
              <Link to="/economy/financials">Μετάβαση</Link>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shortcut-card">
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <BarChartOutlined style={{ fontSize: 32 }} />
              <Text strong>Διαχείριση Εξόδων</Text>
              <Link to="/economy/expenses">Μετάβαση</Link>
            </Space>
          </Card>
        </Col>
      </Row>
      
      <Divider />
      
      {/* Tabs for different views */}
      <Tabs defaultActiveKey="daily" className="dashboard-tabs">
        <TabPane 
          tab={<span><CalendarOutlined /> Ημερήσια Στοιχεία</span>} 
          key="daily"
        >
          <Card title={`Ημερήσια Οικονομικά Στοιχεία - ${moment().format('MMMM YYYY')}`}>
            {dailyData.length > 0 ? (
              <Table 
                dataSource={dailyData} 
                columns={columns} 
                rowKey="id"
                pagination={{ pageSize: 7 }}
              />
            ) : (
              <Alert 
                message="Δεν υπάρχουν διαθέσιμα ημερήσια στοιχεία" 
                description="Δεν έχουν καταχωρηθεί ημερήσια οικονομικά στοιχεία για τον τρέχοντα μήνα."
                type="info"
                showIcon
              />
            )}
          </Card>
        </TabPane>
        
        <TabPane 
          tab={<span><BarChartOutlined /> Αναλύσεις</span>} 
          key="analytics"
        >
          <Card title="Οικονομικές Αναλύσεις">
            <Alert
              message="Ερχόμενη λειτουργικότητα"
              description="Οι αναλύσεις και τα γραφήματα θα είναι διαθέσιμα σε επόμενη έκδοση της εφαρμογής."
              type="info"
              showIcon
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default EconomyDashboardPage; 