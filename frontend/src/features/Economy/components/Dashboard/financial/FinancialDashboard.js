import React, { useState } from 'react';
import { Card, Row, Col, Spin, Alert, Select, DatePicker } from 'antd';
import { 
  BarChartOutlined, 
  LineChartOutlined, 
  PieChartOutlined,
  DollarOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import moment from 'moment';
import useFinancialDashboard from '../../hooks/useFinancialDashboard';
import '../../styles/FinancialDashboard.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

const FinancialDashboard = () => {
  const [dateRangeType, setDateRangeType] = useState('last30');
  
  const {
    dashboardData,
    isLoading,
    error,
    updateDateRange,
    updateTimeFrame,
    refreshDashboard,
    formatCurrency
  } = useFinancialDashboard();

  const {
    totalSales,
    totalExpenses,
    netProfit,
    profitMargin,
    chartData,
    topProducts,
    topCategories
  } = dashboardData;

  // Handle date range selection
  const handleDateRangeChange = (type) => {
    setDateRangeType(type);
    
    switch(type) {
      case 'last7':
        updateDateRange({ days: 7 });
        break;
      case 'last30':
        updateDateRange({ days: 30 });
        break;
      case 'last90':
        updateDateRange({ days: 90 });
        break;
      case 'thisMonth':
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        updateDateRange({ startDate: firstDay, endDate: lastDay });
        break;
      case 'lastMonth':
        const lastMonthEnd = new Date();
        lastMonthEnd.setDate(0); // Last day of previous month
        const lastMonthStart = new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth(), 1);
        updateDateRange({ startDate: lastMonthStart, endDate: lastMonthEnd });
        break;
      case 'custom':
        // Custom date range will be handled by the RangePicker
        break;
      default:
        updateDateRange({ days: 30 });
    }
  };

  // Handle custom date range
  const handleCustomDateRange = (dates) => {
    if (dates && dates.length === 2) {
      updateDateRange({
        startDate: dates[0].toDate(),
        endDate: dates[1].toDate()
      });
    }
  };

  // Handle time frame change for charts
  const handleTimeFrameChange = (value) => {
    updateTimeFrame(value);
  };

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="financial-dashboard">
      <div className="dashboard-header">
        <h1>Financial Dashboard</h1>
        
        <div className="dashboard-controls">
          <div className="date-controls">
            <Select 
              value={dateRangeType} 
              onChange={handleDateRangeChange}
              style={{ width: 120 }}
            >
              <Option value="last7">Last 7 days</Option>
              <Option value="last30">Last 30 days</Option>
              <Option value="last90">Last 90 days</Option>
              <Option value="thisMonth">This Month</Option>
              <Option value="lastMonth">Last Month</Option>
              <Option value="custom">Custom Range</Option>
            </Select>
            
            {dateRangeType === 'custom' && (
              <RangePicker 
                onChange={handleCustomDateRange}
                style={{ marginLeft: 8 }}
              />
            )}
          </div>
          
          <div className="view-controls">
            <Select 
              defaultValue="day" 
              onChange={handleTimeFrameChange}
              style={{ width: 120 }}
            >
              <Option value="day">Daily</Option>
              <Option value="week">Weekly</Option>
              <Option value="month">Monthly</Option>
            </Select>
          </div>
        </div>
      </div>

      <Spin spinning={isLoading}>
        <Row gutter={[16, 16]} className="metric-cards">
          <Col xs={24} sm={12} md={6}>
            <Card className="metric-card sales-card">
              <div className="metric-icon">
                <DollarOutlined />
              </div>
              <div className="metric-content">
                <h3>Total Sales</h3>
                <p className="metric-value">{formatCurrency(totalSales)}</p>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Card className="metric-card expenses-card">
              <div className="metric-icon">
                <DollarOutlined />
              </div>
              <div className="metric-content">
                <h3>Total Expenses</h3>
                <p className="metric-value">{formatCurrency(totalExpenses)}</p>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Card className="metric-card profit-card">
              <div className="metric-icon">
                <DollarOutlined />
              </div>
              <div className="metric-content">
                <h3>Net Profit</h3>
                <p className="metric-value">{formatCurrency(netProfit)}</p>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Card className="metric-card margin-card">
              <div className="metric-icon">
                <BarChartOutlined />
              </div>
              <div className="metric-content">
                <h3>Profit Margin</h3>
                <p className="metric-value">{profitMargin.toFixed(2)}%</p>
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="chart-section">
          <Col xs={24} md={16}>
            <Card 
              title="Sales vs Expenses" 
              className="chart-card"
              extra={<LineChartOutlined />}
            >
              <div className="chart-container">
                {/* Chart would be rendered here - we'd use a library like Chart.js or Recharts */}
                <div className="chart-placeholder">
                  <p>Sales vs Expenses Chart</p>
                  <p>Labels: {chartData.labels.join(', ')}</p>
                  <p>Datasets: {chartData.datasets.map(ds => ds.label).join(', ')}</p>
                </div>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card 
              title="Top Products" 
              className="chart-card"
              extra={<PieChartOutlined />}
            >
              <div className="top-items-list">
                {topProducts.map((product, index) => (
                  <div className="top-item" key={index}>
                    <span className="top-item-name">{product.name}</span>
                    <span className="top-item-value">{formatCurrency(product.total)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="category-section">
          <Col xs={24} md={12}>
            <Card 
              title="Sales by Category" 
              className="chart-card"
              extra={<PieChartOutlined />}
            >
              <div className="top-items-list">
                {topCategories.map((category, index) => (
                  <div className="top-item" key={index}>
                    <span className="top-item-name">{category.name}</span>
                    <span className="top-item-value">{formatCurrency(category.total)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <Card 
              title="Monthly Trend" 
              className="chart-card"
              extra={<CalendarOutlined />}
            >
              <div className="chart-container">
                {/* Monthly trend chart would be rendered here */}
                <div className="chart-placeholder">
                  <p>Monthly Trend Chart</p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default FinancialDashboard; 